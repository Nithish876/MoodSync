import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Alert, NativeModules } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WordBubble } from './WordBubble';
import { saveWordCloud, loadWordCloud } from '../../utils/storage';
import { saveToFirestore, loadFromFirestore } from '../../utils/firestore';
import { useAuth } from '../../hooks/useAuth';
import { SavedWordCloud, WordEntry } from '../../types/mood';
import type { WordCloudHandle } from '../../types/components';
import { sendFriendMoodUpdateNotification } from '../../services/notification';
import { getFriendsList } from '../../utils/friends';
import { callWidgetUpdateServerFunction } from '../../utils/widgetHelpers';

const { WidgetModule } = NativeModules;
const { width } = Dimensions.get('window');
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];

// Helper function to get main words as a string
const getMainWords = (words: WordEntry[]): string => {
  return words
    .slice(0, 3)
    .map(word => word.text)
    .join(', ');
};

export const WordCloud = forwardRef<WordCloudHandle>((props: { hideSaveButton?: boolean } = {}, ref) => {
  const [title, setTitle] = useState('');
  const [entries, setEntries] = useState<string[]>(Array(5).fill(''));
  const [isAnimating, setIsAnimating] = useState(false);
  const [words, setWords] = useState<WordEntry[]>([]);
  const { user } = useAuth();

  useImperativeHandle(ref, () => ({
    getWordCloudData: () => ({
      title,
      words,
      timestamp: Date.now(),
      userId: user?.uid || '',
      summary: {
        title,
        mainWords: getMainWords(words),
        wordCount: words.length
      }
    }),
    hideSaveButton: props.hideSaveButton
  }));

  // Load saved data on mount
  useEffect(() => {
    loadSavedData();
  }, [user]);

  const loadSavedData = async () => {
    if (!user) return;

    try {
      const localData = await loadWordCloud();
      const firestoreData = await loadFromFirestore<SavedWordCloud>('wordClouds', user.uid);
      
      const savedData = (firestoreData?.timestamp ?? 0) > (localData?.timestamp ?? 0)
        ? firestoreData
        : localData;

      if (savedData && Array.isArray(savedData.words) && savedData.words.length > 0) {
        setTitle(savedData.title || '');
        setWords(savedData.words);
        setIsAnimating(true);
      }
    } catch (error) {
      console.error('Error loading word cloud data:', error);
    }
  };

  const handleSave = async () => {
    // Create words array from the entries
    const filteredEntries = entries.filter(entry => entry.trim().length > 0);
    
    if (filteredEntries.length === 0) {
      Alert.alert('Error', 'Please enter at least one word');
      return;
    }
    
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }
    
    const newWords: WordEntry[] = filteredEntries.map((entry, index) => ({
      id: `word-${index}-${Date.now()}`,
      text: entry.trim(),
      size: Math.random() * 60 + 40, // Random size between 40-100
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
    
    setWords(newWords);
    setIsAnimating(true);
    
    // Save to local storage and Firestore
    if (user) {
      const cloudData: SavedWordCloud = {
        title,
        words: newWords,
        timestamp: Date.now(),
        userId: user.uid,
        summary: {
          title: title,
          mainWords: getMainWords(newWords),
          wordCount: newWords.length
        }
      };
      
      try {
        await saveWordCloud(cloudData);
        await saveToFirestore('wordClouds', user.uid, cloudData);
        
        // Sync data with widget
        if (WidgetModule && WidgetModule.syncWordCloudData) {
          // Extract just the words as text for the widget display
          const wordsText = newWords.map(word => word.text).join(", ");
          
          // Create a more widget-friendly version of the data
          const widgetData = {
            title: title,
            text: wordsText,  // Add a simple text representation
            words: newWords   // Keep the full data structure too
          };
          
          WidgetModule.syncWordCloudData(JSON.stringify(widgetData), true);
        }
        
        // Trigger server function to notify friends and update their widgets
        try {
          const friends = await getFriendsList(user.uid);
          if (friends && friends.length > 0) {
            const friendIds = friends.map(friend => friend.id).filter(id => id !== user.uid);
            if (friendIds.length > 0) {
              // Call server function to notify friends
              await callWidgetUpdateServerFunction(user.uid, 'word_cloud', friendIds);
            }
          }
        } catch (error) {
          console.error('Error notifying friends:', error);
          // Don't block the save operation if notification fails
        }
        
        Alert.alert('Success', 'Your word cloud has been saved!');
      } catch (error) {
        console.error('Error saving word cloud:', error);
        Alert.alert('Error', 'Failed to save your word cloud');
      }
    }
  };

  const handleReset = () => {
    setTitle('');
    setEntries(Array(5).fill(''));
    setWords([]);
    setIsAnimating(false);
  };

  const handleEntryChange = (text: string, index: number) => {
    const newEntries = [...entries];
    newEntries[index] = text;
    setEntries(newEntries);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Word Cloud</Text>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Ionicons name="refresh-outline" size={20} color="#000" />
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.contentScrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {!isAnimating ? (
          <View style={styles.content}>
            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter a title for your word cloud"
              value={title}
              onChangeText={setTitle}
              maxLength={30}
            />
            
            {entries.map((entry, index) => (
              <TextInput
                key={index}
                style={styles.input}
                placeholder={`Your Text ${index + 1}`}
                value={entry}
                onChangeText={(text) => handleEntryChange(text, index)}
                maxLength={20}
              />
            ))}
          </View>
        ) : (
          <View style={styles.bubbleContainer}>
            <WordBubble 
              words={words} 
              size={width * 0.7} 
              title={title}
            />
          </View>
        )}
      </ScrollView>
      
      {!isAnimating && !props.hideSaveButton && (
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>SAVE</Text>
        </TouchableOpacity>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE5E5',
    borderRadius: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 25,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  resetText: {
    marginLeft: 5,
    fontWeight: '500',
  },
  contentScrollContainer: {
    flexGrow: 1,
    paddingBottom: 80, // Space for the save button
  },
  content: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#444',
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  saveButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bubbleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
}); 