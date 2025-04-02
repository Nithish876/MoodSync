import { NativeModules } from 'react-native';
import type { EmojiMood, SavedColorMix, SavedWordCloud, WordEntry } from '../types/mood';
import { loadColorMix, loadWordCloud } from './storage';
import { loadFromFirestore } from './firestore';

const { WidgetModule } = NativeModules;

// Process color mix data into a single representative color hex
function processColorMixForWidget(moods: EmojiMood[]): string {
  if (!moods || moods.length === 0) {
    return '#CCCCCC'; // Default gray if no mood data
  }
  
  // If there's only one mood, return its color
  if (moods.length === 1) {
    return moods[0].color;
  }
  
  // For multiple moods, we'll create a weighted average based on percentages
  // This is a simplified approach - you might want a more complex algorithm
  
  let totalWeight = 0;
  let r = 0, g = 0, b = 0;
  
  moods.forEach(mood => {
    const weight = mood.percentage;
    totalWeight += weight;
    
    // Convert hex to RGB
    const hex = mood.color.replace('#', '');
    const rgb = parseInt(hex, 16);
    const red = (rgb >> 16) & 0xFF;
    const green = (rgb >> 8) & 0xFF;
    const blue = rgb & 0xFF;
    
    // Add weighted contribution
    r += red * weight;
    g += green * weight;
    b += blue * weight;
  });
  
  // Calculate weighted average
  r = Math.round(r / totalWeight);
  g = Math.round(g / totalWeight);
  b = Math.round(b / totalWeight);
  
  // Convert back to hex
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Process word cloud data into representative text
function processWordCloudForWidget(words: WordEntry[], title: string): string {
  if (!words || words.length === 0) {
    return title || "No mood yet";
  }
  
  // Sort words by size (if size represents importance)
  const sortedWords = [...words].sort((a, b) => b.size - a.size);
  
  // Take the top 3 words
  const topWords = sortedWords.slice(0, 3).map(word => word.text);
  
  return topWords.join(', ');
}

// Sync current user's mood data with widgets
export async function syncUserMoodData(userId: string) {
  try {
    // Get latest color mix data
    const localColorMix = await loadColorMix();
    const firestoreColorMix = await loadFromFirestore<SavedColorMix>('colorMixes', userId);
    
    const colorMix = (firestoreColorMix?.timestamp ?? 0) > (localColorMix?.timestamp ?? 0)
      ? firestoreColorMix
      : localColorMix;
    
    if (colorMix?.moods?.length) {
      const colorHex = processColorMixForWidget(colorMix.moods);
      await WidgetModule.syncColorMixData(userId, colorHex);
    }
    
    // Get latest word cloud data
    const localWordCloud = await loadWordCloud();
    const firestoreWordCloud = await loadFromFirestore<SavedWordCloud>('wordClouds', userId);
    
    const wordCloud = (firestoreWordCloud?.timestamp ?? 0) > (localWordCloud?.timestamp ?? 0)
      ? firestoreWordCloud
      : localWordCloud;
    
    if (wordCloud?.words?.length) {
      const mainWord = processWordCloudForWidget(wordCloud.words, wordCloud.title || '');
      await WidgetModule.syncWordCloudData(userId, mainWord);
    }
    
    return true;
  } catch (error) {
    console.error('Error syncing user mood data with widgets:', error);
    return false;
  }
}

// Configure a widget
export async function configureWidget(
  widgetId: number,
  widgetType: 'small' | 'large',
  config: {
    type: 'my' | 'friend',
    display: 'color' | 'word',
    friendId?: string,
    friendName?: string
  }
) {
  try {
    await WidgetModule.configureWidget(widgetId, {
      ...config,
      widgetType
    });
    return true;
  } catch (error) {
    console.error('Error configuring widget:', error);
    return false;
  }
}

// Function to sync friend mood data with widget system
export const syncFriendMoodColor = async (friendId: string, friendName: string, colorHex: string) => {
  if (NativeModules.WidgetModule) {
    try {
      await NativeModules.WidgetModule.syncFriendMoodData(friendId, friendName, colorHex);
      console.log(`Synced ${friendName}'s mood color to widgets`);
    } catch (error) {
      console.error('Failed to sync friend mood color with widgets:', error);
    }
  }
};

// Function to sync friend word cloud with widget system
export const syncFriendWordCloud = async (friendId: string, friendName: string, words: string) => {
  if (NativeModules.WidgetModule) {
    try {
      await NativeModules.WidgetModule.syncFriendWordCloudData(friendId, friendName, words);
      console.log(`Synced ${friendName}'s word cloud to widgets`);
    } catch (error) {
      console.error('Failed to sync friend word cloud with widgets:', error);
    }
  }
}; 