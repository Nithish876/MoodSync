import React, { useMemo } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { EMOJI_OPTIONS } from '../../constants/emojis';
import { Ionicons } from '@expo/vector-icons'; 
import type { EmojiMood } from '../../types/mood';

interface EmojiSelectorProps {
  onSelect: (emoji: string, color: string) => void;
  onRemove: (id: string) => void;
  selectedCount: number;
  onCustomizePress: () => void;
  customEmojiOptions?: {emoji: string, color: string, name: string}[];
  activeMoods?: EmojiMood[];
}

export const EmojiSelector = ({ 
  onSelect, 
  onRemove,
  selectedCount = 0, 
  onCustomizePress,
  customEmojiOptions = [],
  activeMoods = []
}: EmojiSelectorProps) => {
  
  // Define the function BEFORE it's used in useMemo
  const findNameForEmoji = (emoji: string): string => {
    const option = EMOJI_OPTIONS.find(opt => opt.emoji === emoji);
    return option?.name || "Mood";
  };
  
  // Group active moods by emoji for the removal section
  const groupedMoods = useMemo(() => {
    const grouped: Record<string, EmojiMood[]> = {};
    
    activeMoods.forEach(mood => {
      const key = `${mood.emoji}-${mood.color}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(mood);
    });
    
    return Object.entries(grouped).map(([key, moodList]) => {
      return {
        key,
        emoji: moodList[0].emoji,
        color: moodList[0].color,
        name: moodList[0].name || findNameForEmoji(moodList[0].emoji),
        count: moodList.length,
        moods: moodList
      };
    });
  }, [activeMoods]);
  
  return (
    <View style={styles.container}>
      {/* Active Moods Section (for removal) */}
      {activeMoods.length > 0 && (
        <View style={styles.activeMoodsSection}>
          <Text style={styles.sectionTitle}>Your Active Moods:</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.activeMoodsContainer}
          >
            {groupedMoods.map((group) => (
              <View key={group.key} style={styles.activeMoodGroup}>
                <View style={[styles.activeMoodCircle, { backgroundColor: group.color }]}>
                  <Text style={styles.activeMoodEmoji}>{group.emoji}</Text>
                  {group.count > 1 && (
                    <View style={styles.countBadge}>
                      <Text style={styles.countText}>{group.count}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.activeMoodName}>{group.name}</Text>
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => onRemove(group.moods[0].id)}
                >
                  <Ionicons name="remove-circle" size={18} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    
      {/* Emoji Selection Section */}
      <View style={styles.selectionSection}>
        <Text style={styles.sectionTitle}>Add a mood:</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {/* Default emoji options */}
          {EMOJI_OPTIONS.map(({ emoji, color, name }) => (
            <TouchableOpacity
              key={`default-${emoji}-${color}`}
              style={styles.emojiButton}
              onPress={() => onSelect(emoji, color)}
            >
              <View style={[styles.colorCircle, { backgroundColor: color }]}>
                <Text style={styles.emojiText}>{emoji}</Text>
              </View>
              <Text style={styles.emojiName} numberOfLines={1}>{name}</Text>
            </TouchableOpacity>
          ))}
          
          {/* Custom emoji options */}
          {customEmojiOptions.map(({ emoji, color, name }) => (
            <TouchableOpacity
              key={`custom-${emoji}-${color}-${name}`}
              style={styles.emojiButton}
              onPress={() => onSelect(emoji, color)}
            >
              <View style={[styles.colorCircle, { backgroundColor: color }]}>
                <Text style={styles.emojiText}>{emoji}</Text>
              </View>
              <Text style={styles.customEmojiName} numberOfLines={1}>{name}</Text>
            </TouchableOpacity>
          ))}
          
          {/* Add custom emoji button */}
          <TouchableOpacity
            style={styles.addCustomButton}
            onPress={onCustomizePress}
          >
            <View style={[styles.colorCircle, { backgroundColor: '#DDD' }]}>
              <Text style={styles.emojiText}>+</Text>
            </View>
            <Text style={styles.emojiName}>Custom</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 10,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginVertical: 5,
    color: '#555',
    paddingHorizontal: 10,
  },
  activeMoodsSection: {
    marginBottom: 10,
  },
  activeMoodsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  activeMoodGroup: {
    marginHorizontal: 5,
    alignItems: 'center',
    position: 'relative',
    width: 60, // Fixed width for consistent spacing
  },
  activeMoodCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  activeMoodEmoji: {
    fontSize: 22,
  },
  activeMoodName: {
    fontSize: 12,
    marginTop: 4,
    maxWidth: 60,
    textAlign: 'center',
  },
  countBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  removeButton: {
    position: 'absolute',
    bottom: 25,
    right: 0,
  },
  selectionSection: {
    marginTop: 10,
  },
  scrollContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  emojiButton: {
    marginHorizontal: 5,
    alignItems: 'center',
    width: 60, // Fixed width for consistent spacing
  },
  colorCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  emojiText: {
    fontSize: 22,
  },
  emojiName: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    width: '100%',
  },
  customEmojiName: {
    fontSize: 12,
    marginTop: 4,
    maxWidth: 60,
    textAlign: 'center',
  },
  addCustomButton: {
    marginHorizontal: 5,
    alignItems: 'center',
    width: 60,
  },
});