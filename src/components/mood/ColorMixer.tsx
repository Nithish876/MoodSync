import React, { useState, useCallback, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, NativeModules, Modal, Alert, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Reanimated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
} from 'react-native-reanimated';
import { GlassBall } from './GlassBall';
import { MoodCustomizer } from './MoodCustomizer';
import type { EmojiMood, SavedColorMix } from '../../types/mood';
import { EmojiSelector } from './EmojiSelector';
import { saveColorMix, loadColorMix } from '../../utils/storage';
import { saveToFirestore, loadFromFirestore } from '../../utils/firestore';
import { useAuth } from '../../hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EMOJI_OPTIONS, moodDescriptions } from '../../constants/emojis';
import type { ColorMixerHandle } from '../../types/components';
import { prepareWidgetId } from '../../utils/widgetUtils';
import { getFriendsList } from '../../utils/friends';
import { sendFriendMoodUpdateNotification } from '../../services/notification';
import { syncSimplifiedWidgetData } from '../../utils/widgetHelpers';
import { updateWidgetWithGuaranteedFormat, updateWidgetsWithExactFormat } from '../../utils/widgetHelpers';
import { simpleWidgetSync, callWidgetUpdateServerFunction } from '../../utils/widgetHelpers';

const { width } = Dimensions.get('window');
const { WidgetModule } = NativeModules;

const MAX_MOODS = 100; // Limit mood additions
const CUSTOM_EMOJIS_STORAGE_KEY = 'custom_emoji_options';

export const ColorMixer = forwardRef<ColorMixerHandle, any>((props, ref) => {
  const [moods, setMoods] = useState<EmojiMood[]>([]);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [customEmojiOptions, setCustomEmojiOptions] = useState<{emoji: string, color: string, name: string}[]>([]);
  const bubbleAnimation = useSharedValue(1);
  const { user } = useAuth();

  useEffect(() => {
    const loadSavedData = async () => {
      if (!user) return;

      const localData = await loadColorMix();
      const firestoreData = await loadFromFirestore<SavedColorMix>('colorMixes', user.uid);
      
      const savedData = (firestoreData?.timestamp ?? 0) > (localData?.timestamp ?? 0)
        ? firestoreData
        : localData;

      if (savedData?.moods) {
        setMoods(savedData.moods);
      }
      
      // Load custom emoji options
      try {
        const storedCustomEmojis = await AsyncStorage.getItem(CUSTOM_EMOJIS_STORAGE_KEY);
        if (storedCustomEmojis) {
          setCustomEmojiOptions(JSON.parse(storedCustomEmojis));
        }
      } catch (error) {
        console.error('Failed to load custom emojis:', error);
      }
    };
    loadSavedData();
  }, [user]);

  // Save custom emojis to storage
  const saveCustomEmojis = async (newCustomEmojis: {emoji: string, color: string, name: string}[]) => {
    try {
      await AsyncStorage.setItem(CUSTOM_EMOJIS_STORAGE_KEY, JSON.stringify(newCustomEmojis));
    } catch (error) {
      console.error('Failed to save custom emojis:', error);
    }
  };

  // Calculate mood distribution and create a cute summary
  const moodSummary = useMemo(() => {
    if (!moods.length) return null;
    
    // Group moods by emoji and calculate percentages
    const emojiCount: Record<string, number> = {};
    moods.forEach(mood => {
      if (emojiCount[mood.emoji]) {
        emojiCount[mood.emoji]++;
      } else {
        emojiCount[mood.emoji] = 1;
      }
    });
    
    const total = moods.length;
    const percentages = Object.entries(emojiCount)
      .map(([emoji, count]) => {
        // Find the name for this emoji
        const emojiOption = [...EMOJI_OPTIONS, ...customEmojiOptions].find(opt => opt.emoji === emoji);
        const name = emojiOption?.name || "Custom";
        return {
          emoji,
          name,
          percentage: Math.round((count / total) * 100)
        };
      })
      .sort((a, b) => b.percentage - a.percentage);
    
    const topMoods = percentages.slice(0, 3);
    
    // Simple percentage breakdown
    const breakdownText = topMoods.map(mood => `${mood.percentage}% ${mood.emoji} ${mood.name}`).join(', ');
    
    // Create a cute narrative based on the top moods
    let narrativeText = "";
    
    if (topMoods.length === 1) {
      narrativeText = `Feeling ${topMoods[0].percentage}% ${topMoods[0].name} ${topMoods[0].emoji}`;
    } 
    else if (topMoods.length === 2) {
      narrativeText = `A mix of ${topMoods[0].name} ${topMoods[0].emoji} (${topMoods[0].percentage}%) and ${topMoods[1].name} ${topMoods[1].emoji} (${topMoods[1].percentage}%)`;
    } 
    else {
      narrativeText = `Mostly ${topMoods[0].name} ${topMoods[0].emoji} with some ${topMoods[1].name} ${topMoods[1].emoji} and a hint of ${topMoods[2].name} ${topMoods[2].emoji}`;
    }
    
    return {
      breakdown: breakdownText,
      narrative: narrativeText,
      moodData: percentages
    };
    
  }, [moods, customEmojiOptions]);

  const saveData = async (newMoods: EmojiMood[]) => {
    if (!user) return;

    const data = {
      moods: newMoods,
      timestamp: Date.now(),
      userId: user.uid,
    };

    await saveColorMix(data);
    await saveToFirestore('colorMixes', user.uid, data);
  };

  const calculateCombinedColor = (moodList: EmojiMood[]): string => {
    if (!moodList || moodList.length === 0) {
      return '#CCCCCC'; // Default gray
    }
    
    if (moodList.length === 1) {
      return moodList[0].color;
    }
    
    // Calculate weighted average based on count
    let totalCount = moodList.length;
    let r = 0, g = 0, b = 0;
    
    // Count occurrences of each color
    const colorCounts: Record<string, number> = {};
    moodList.forEach(mood => {
      if (colorCounts[mood.color]) {
        colorCounts[mood.color]++;
      } else {
        colorCounts[mood.color] = 1;
      }
    });
    
    // Calculate weighted color
    Object.entries(colorCounts).forEach(([color, count]) => {
      const hex = color.replace('#', '');
      const rgb = parseInt(hex, 16);
      const red = (rgb >> 16) & 0xFF;
      const green = (rgb >> 8) & 0xFF;
      const blue = rgb & 0xFF;
      
      // Add weighted contribution
      r += red * (count / totalCount);
      g += green * (count / totalCount);
      b += blue * (count / totalCount);
    });
    
    // Round to integers
    r = Math.round(r);
    g = Math.round(g);
    b = Math.round(b);
    
    // Convert back to hex
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  const updateWidgetsWithColorMix = async (colorMix: string) => {
    if (!user) return;
    
    try {
      console.log('Updating widgets with latest color mix data');
      
      // Get mood summary data for widgets with ALL needed fields
      const summaryData = moodSummary?.moodData || [];
      const moodPercentages = {
        userId: user.uid,
        moods: moods,  // Include full mood objects
        emojis: summaryData.map(m => m.emoji),
        names: summaryData.map(m => m.name),
        percentages: summaryData.map(m => m.percentage),
        narrative: moodSummary?.narrative || "No moods added yet",
        mixedColor: colorMix,  // Include the calculated mixed color
        timestamp: Date.now()
      };
      
      // Log the complete data we're sending
      console.log('Sending to widgets:', JSON.stringify(moodPercentages));
      
      // Use updateUserMoodPercentages with the complete data
      await WidgetModule.updateUserColorMixData(
        JSON.stringify(moodPercentages)
      );
      
      // Then also send to updateUserMoodPercentages which might be used by small widgets
      await WidgetModule.updateUserMoodPercentages(
        JSON.stringify(moodPercentages)
      );
      
      // Force update all widgets to refresh their data
      await WidgetModule.forceUpdateAllWidgets();
      
      console.log('Widget update completed successfully');
    } catch (error) {
      console.error('Failed to update widgets:', error);
    }
  };

  const handleEmojiSelect = async (emoji: string, color: string) => {
    if (moods.length >= MAX_MOODS) {
      Alert.alert(
        "Maximum Moods Reached",
        `You can add up to ${MAX_MOODS} moods. Please remove some moods to add more.`
      );
      return;
    }
    
    // Find a name for this emoji from our predefined list or custom options
    let emojiName = "";
    const predefinedEmoji = EMOJI_OPTIONS.find(e => e.emoji === emoji);
    const customEmoji = customEmojiOptions.find(e => e.emoji === emoji && e.color === color);
    
    if (predefinedEmoji) {
      emojiName = predefinedEmoji.name;
    } else if (customEmoji) {
      emojiName = customEmoji.name;
    }
    
    const newMood: EmojiMood = {
      id: Date.now().toString(),
      emoji,
      color,
      name: emojiName,
      timestamp: Date.now(),
      percentage: 100 / (moods.length + 1), // Equal distribution for new mood
      volume: 1, // Default volume
    };
    
    // Update percentages for all moods
    const updatedMoods = [...moods, newMood].map(mood => ({
      ...mood,
      percentage: 100 / (moods.length + 1) // Redistribute percentages evenly
    }));
    setMoods(updatedMoods);
    
    // Create a bubble animation
    bubbleAnimation.value = withSequence(
      withSpring(1.2, { damping: 10 }),
      withSpring(1, { damping: 15 })
    );
    
    await saveData(updatedMoods);
  };
  
  const handleRemoveMood = (id: string) => {
    const updatedMoods = moods.filter(mood => mood.id !== id);
    setMoods(updatedMoods);
    saveData(updatedMoods);
  };

  // Handle custom mood creation
  const handleCustomMood = (name: string, emoji: string, color: string) => {
    // Add to custom emoji options if it doesn't exist
    const existingEmojiIndex = customEmojiOptions.findIndex(item => 
      item.emoji === emoji && item.color === color && item.name === name);
    
    if (existingEmojiIndex === -1) {
      const newCustomEmojis = [...customEmojiOptions, { emoji, color, name }];
      setCustomEmojiOptions(newCustomEmojis);
      saveCustomEmojis(newCustomEmojis);
    }
    
    // Add the mood to the current mood mix
    handleEmojiSelect(emoji, color);
    setShowCustomizer(false);
  };

  const handleReset = async () => {
    setMoods([]);
    await saveData([]);
  };

  const bubbleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: bubbleAnimation.value }],
    };
  });

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    getMoodData: () => moods
  }));

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Color Mix</Text>
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={handleReset}
          >
            <Ionicons name="refresh-outline" size={20} color="#000" />
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <Reanimated.View style={[styles.bubbleContainer, bubbleStyle]}>
          <GlassBall 
            moods={moods}
            size={140}
          />
        </Reanimated.View>

        {moods.length > 0 && (
          <View style={styles.moodSummaryContainer}>
            <Text style={styles.moodSummary}>
              {moodSummary?.narrative}
            </Text>
            <Text style={styles.moodCounter}>
              {moods.length} {moods.length === 1 ? 'mood' : 'moods'} added
            </Text>
          </View>
        )}

        {moods.length > 0 && (
          <View style={styles.moodTracker}>
            {moodSummary?.moodData.map((mood) => (
              <View key={mood.emoji} style={styles.emojiItem}>
                <Text style={styles.emoji}>{mood.emoji}</Text>
                <Text style={styles.percentage}>{mood.percentage}%</Text>
              </View>
            ))}
          </View>
        )}
        
        <EmojiSelector
          onSelect={handleEmojiSelect}
          onRemove={handleRemoveMood}
          selectedCount={moods.length}
          onCustomizePress={() => setShowCustomizer(true)}
          customEmojiOptions={customEmojiOptions}
          activeMoods={moods}
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={async () => {
            if (!user || moods.length === 0) return;
            
            // First save to storage
            await saveData(moods);
            
            // Get the mixed color
            const mixedColor = calculateCombinedColor(moods);
            
            // Get the narrative
            const narrative = moodSummary?.narrative || "No mood data yet";
            
            // ONLY update widgets with minimal format - REMOVE ALL OTHER WIDGET UPDATES
            try {
              await simpleWidgetSync(user.uid, narrative, mixedColor);
              
              // Trigger server function to notify friends and update their widgets
              try {
                const friends = await getFriendsList(user.uid);
                if (friends && friends.length > 0) {
                  const friendIds = friends.map(friend => friend.id).filter(id => id !== user.uid);
                  if (friendIds.length > 0) {
                    // Call server function to notify friends
                    await callWidgetUpdateServerFunction(user.uid, 'color_mix', friendIds);
                  }
                }
              } catch (notifyError) {
                console.error('Error notifying friends:', notifyError);
                // Don't block the save operation if notification fails
              }
              
              Alert.alert("Success", "Your mood has been saved and widgets updated!");
            } catch (error) {
              console.error("Error updating widgets:", error);
            }
          }}
          disabled={moods.length === 0}
        >
          <Text style={styles.saveButtonText}>Save Mood</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        transparent={true}
        visible={showCustomizer}
        animationType="fade"
        onRequestClose={() => setShowCustomizer(false)}
      >
        <MoodCustomizer
          onSave={handleCustomMood}
          onCancel={() => setShowCustomizer(false)}
          existingCustomEmojis={customEmojiOptions}
        />
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F5',
    width: '100%',
    height: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resetText: {
    marginLeft: 5,
    fontWeight: '500',
    fontSize: 14,
  },
  bubbleContainer: {
    width: 140,
    height: 140,
    marginVertical: 5,
    alignSelf: 'center',
  },
  moodSummaryContainer: {
    marginVertical: 5,
    alignItems: 'center',
  },
  moodSummary: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
  moodCounter: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
  },
  moodTracker: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    flexWrap: 'wrap',
  },
  emojiItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4,
    marginBottom: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 12,
  },
  emoji: {
    fontSize: 16,
    marginRight: 4,
  },
  percentage: {
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
    marginHorizontal: 15,
    marginBottom: 15,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
