import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { EmojiMood } from '../../types/mood';

interface GlassBallProps {
  moods: EmojiMood[];
  size?: number;
}

export const GlassBall = ({ moods = [], size = 300 }: GlassBallProps) => {
  const moodColors = useMemo(() => {
    // Get unique colors to prevent duplicates
    return moods.reduce((acc, mood) => {
      if (!acc.includes(mood.color)) {
        acc.push(mood.color);
      }
      return acc;
    }, [] as string[]);
  }, [moods]);

  // Create gradient effect based on mood distribution
  const gradientColors = useMemo(() => {
    if (moodColors.length === 0) {
      return ['rgba(255,255,255,0.7)', 'rgba(240,240,255,0.8)'] as [string, string];
    } else if (moodColors.length === 1) {
      // Single color - create a gradient with that color
      const baseColor = moodColors[0];
      return [
        `${baseColor}80`, // Base color with 50% opacity
        `${baseColor}BF`, // Base color with 75% opacity
        `${baseColor}40`  // Base color with 25% opacity
      ] as [string, string, string];
    } else {
      // Multiple colors - create smooth transitions
      // Add transparency to make it more glass-like
      const colors = moodColors.map(color => `${color}AF`);
      // Ensure at least two colors
      return colors.length >= 2 ? colors : [...colors, colors[0]];
    }
  }, [moodColors]);

  // Calculate gradient locations
  const gradientLocations = useMemo(() => {
    if (gradientColors.length <= 2) return undefined;
    const locations = gradientColors.map((_, i) => i / (gradientColors.length - 1));
    return locations as [number, number, ...number[]];
  }, [gradientColors]);

  // Create highlights based on colors
  const highlightColor = useMemo(() => {
    if (moodColors.length === 0) return 'rgba(255,255,255,0.8)';
    return `${moodColors[0]}30`; // Very transparent version of first color
  }, [moodColors]);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Main bubble gradient */}
      <LinearGradient
        colors={gradientColors as [string, string, ...string[]]}
        style={[styles.glassBubble, { width: size, height: size }]}
        start={{ x: 0.1, y: 0.1 }}
        end={{ x: 0.9, y: 0.9 }}
        locations={gradientLocations}
      />

      {/* Edge highlight for 3D effect */}
      <LinearGradient
        colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0)']}
        style={[styles.bubbleHighlight, { width: size * 0.95, height: size * 0.95 }]}
        start={{ x: 0.1, y: 0.1 }}
        end={{ x: 0.6, y: 0.6 }}
      />

      {/* Main highlight */}
      <View style={[styles.highlight, { width: size * 0.3, height: size * 0.3 }]} />
      
      {/* Secondary smaller highlight */}
      <View style={[styles.secondaryHighlight, { width: size * 0.15, height: size * 0.15 }]} />
      
      {/* Glass overlay for realism */}
      <LinearGradient
        colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)']}
        style={[styles.glassOverlay, { width: size, height: size }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassBubble: {
    position: 'absolute',
    borderRadius: 999,
    overflow: 'hidden',
  },
  bubbleHighlight: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  glassOverlay: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.4)',
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.6)',
    top: '20%',
    left: '15%',
  },
  secondaryHighlight: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.4)',
    bottom: '25%',
    right: '15%',
  }
});
