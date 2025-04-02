import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SavedWordCloud, SavedColorMix } from '../types/mood';

const STORAGE_KEYS = {
  WORD_CLOUD: '@word_cloud',
  COLOR_MIX: '@color_mix',
};

export const saveWordCloud = async (data: SavedWordCloud) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.WORD_CLOUD, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving word cloud:', error);
  }
};

export const loadWordCloud = async (): Promise<SavedWordCloud | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.WORD_CLOUD);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading word cloud:', error);
    return null;
  }
};

export const saveColorMix = async (data: SavedColorMix) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.COLOR_MIX, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving color mix:', error);
  }
};

export const loadColorMix = async (): Promise<SavedColorMix | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.COLOR_MIX);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading color mix:', error);
    return null;
  }
}; 