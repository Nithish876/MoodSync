import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WordCloud } from '../../components/mood/WordCloud';
import { ColorMixer } from '../../components/mood/ColorMixer';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
} from 'react-native-reanimated';
import type { EmojiMood, SavedColorMix, SavedWordCloud } from '../../types/mood';

const { width } = Dimensions.get('window');

export const MoodEntryScreen = () => {
  const [activeScreen, setActiveScreen] = useState<'color' | 'word'>('color');
  const translateX = useSharedValue(0);
  const colorMixerRef = useRef<{ getMoodData: () => EmojiMood[] }>(null);
  const wordCloudRef = useRef<{ getWordCloudData: () => SavedWordCloud }>(null);

  const handleScreenChange = (screen: 'color' | 'word') => {
    setActiveScreen(screen);
    translateX.value = withSpring(screen === 'color' ? 0 : -width);
  };

  const cardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }]
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Daily Color Mood</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeScreen === 'color' && styles.activeTab]} 
            onPress={() => handleScreenChange('color')}
          >
            <Text style={[styles.tabText, activeScreen === 'color' && styles.activeTabText]}>Color Mix</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeScreen === 'word' && styles.activeTab]} 
            onPress={() => handleScreenChange('word')}
          >
            <Text style={[styles.tabText, activeScreen === 'word' && styles.activeTabText]}>Word Cloud</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Animated.View style={[styles.cardWrapper, cardStyle]}>
        <View style={styles.cardContainer}>
          <ColorMixer ref={colorMixerRef} />
        </View>
        <View style={styles.cardContainer}>
          <WordCloud ref={wordCloudRef} />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  headerContainer: {
    paddingTop: Platform.OS === 'android' ? 30 : 0,
    paddingBottom: 10,
    backgroundColor: '#FFF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeTab: {
    backgroundColor: '#FF6B6B',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  cardWrapper: {
    flex: 1,
    flexDirection: 'row',
    width: width * 2,
  },
  cardContainer: {
    width: width,
    height: '100%',
  },
}); 