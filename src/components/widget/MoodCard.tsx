import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MoodCardProps {
  title: string;
  isReact?: boolean;
  onAddPress: () => void;
  onHomeScreenPress: () => void;
}

export const MoodCard = ({ title, isReact = false, onAddPress, onHomeScreenPress }: MoodCardProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.bubble} />
      <Text style={styles.status}>Doing Good</Text>
      <View style={styles.emojiContainer}>
        {['😊', '😡', '🤢', '😈'].map((emoji, index) => (
          <View key={index} style={styles.emojiWrapper}>
            <Text style={styles.emoji}>{emoji}</Text>
            <Text style={styles.percentage}>20%</Text>
          </View>
        ))}
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={onAddPress}
      >
        <Text style={styles.actionButtonText}>
          {isReact ? 'REACT' : 'ADD'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.homeScreenButton}
        onPress={onHomeScreenPress}
      >
        <Text style={styles.homeScreenButtonText}>Add to Home Screen</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFE5E5',
    borderRadius: 15,
    padding: 15,
    margin: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bubble: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  status: {
    marginVertical: 5,
  },
  emojiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  emojiWrapper: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
  emoji: {
    fontSize: 24,
  },
  percentage: {
    fontSize: 12,
  },
  addButton: {
    marginLeft: 5,
  },
  actionButton: {
    backgroundColor: '#FFF',
    paddingHorizontal: 30,
    paddingVertical: 8,
    borderRadius: 20,
    marginVertical: 5,
  },
  actionButtonText: {
    fontWeight: 'bold',
  },
  homeScreenButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 5,
  },
  homeScreenButtonText: {
    color: '#FFF',
  },
}); 