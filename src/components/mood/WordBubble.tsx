import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Image, Dimensions } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing,
} from 'react-native-reanimated';
import type { WordEntry } from '../../types/mood';

interface WordBubbleProps {
  words: WordEntry[];
  size: number;
  title?: string;
}

const { width } = Dimensions.get('window');

export const WordBubble = ({ words, size = 300, title }: WordBubbleProps) => {
  // Create animated values for each word
  const wordAnimations = words.map(() => ({
    x: useSharedValue(0),
    y: useSharedValue(0),
    scale: useSharedValue(1),
    rotation: useSharedValue(0),
  }));

  const bubbleScale = useSharedValue(1);

  useEffect(() => {
    // Animate the bubble slightly
    bubbleScale.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 2000, easing: Easing.ease }),
        withTiming(0.97, { duration: 2000, easing: Easing.ease })
      ),
      -1,
      true
    );

    // Animate each word independently
    words.forEach((_, index) => {
      // Define unique animation parameters for each word
      const randomOffset = 10; // Maximum random offset in pixels
      const randomSpeed = Math.random() * 1000 + 2000; // Random duration between 2-3 seconds
      const randomDelayMultiplier = Math.random() * 0.5; // Random delay multiplier

      // Create a more gentle floating animation
      const animateWord = () => {
        // Random offset for x and y
        const xOffset = (Math.random() * 2 - 1) * randomOffset;
        const yOffset = (Math.random() * 2 - 1) * randomOffset;
        
        wordAnimations[index].x.value = withRepeat(
          withSequence(
            withTiming(xOffset, { duration: randomSpeed, easing: Easing.inOut(Easing.sin) }),
            withTiming(-xOffset, { duration: randomSpeed, easing: Easing.inOut(Easing.sin) })
          ),
          -1,
          true
        );
        
        wordAnimations[index].y.value = withRepeat(
          withSequence(
            withTiming(yOffset, { duration: randomSpeed * 1.2, easing: Easing.inOut(Easing.sin) }),
            withTiming(-yOffset, { duration: randomSpeed * 1.2, easing: Easing.inOut(Easing.sin) })
          ),
          -1,
          true
        );
        
        // Subtle scale animation
        wordAnimations[index].scale.value = withRepeat(
          withSequence(
            withTiming(1.05, { duration: randomSpeed * 1.5, easing: Easing.inOut(Easing.sin) }),
            withTiming(0.95, { duration: randomSpeed * 1.5, easing: Easing.inOut(Easing.sin) })
          ),
          -1,
          true
        );
        
        // Very subtle rotation animation (less than 5 degrees)
        const rotationAmount = (Math.random() * 0.05 - 0.025);
        wordAnimations[index].rotation.value = withRepeat(
          withSequence(
            withTiming(rotationAmount, { duration: randomSpeed * 2, easing: Easing.inOut(Easing.sin) }),
            withTiming(-rotationAmount, { duration: randomSpeed * 2, easing: Easing.inOut(Easing.sin) })
          ),
          -1,
          true
        );
      };
      
      // Start animation with a delay based on index
      setTimeout(animateWord, index * randomDelayMultiplier * 1000);
    });
  }, [words.length]);

  const bubbleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: bubbleScale.value }],
    };
  });

  return (
    <View style={[styles.container, { width: size, height: size * 1.2 }]}>
      <Animated.View style={[styles.bubbleContainer, bubbleStyle]}>
        <Image 
          source={require('../../assets/images/thought-bubble.png')} 
          style={styles.bubbleImage}
          resizeMode="contain"
        />
        
        {/* Words inside the bubble */}
        {words.map((word, index) => {
          const animatedStyle = useAnimatedStyle(() => {
            return {
              transform: [
                { translateX: wordAnimations[index].x.value },
                { translateY: wordAnimations[index].y.value },
                { scale: wordAnimations[index].scale.value },
                { rotate: `${wordAnimations[index].rotation.value}rad` }
              ],
            };
          });
          
          // Calculate position within the thought bubble
          // Position words in a more scattered pattern within the bubble
          const angle = (index / words.length) * 2 * Math.PI;
          const radius = size * 0.25; // Smaller radius to fit inside thought bubble
          const centerOffsetX = size * 0.1; // Offset from center to fit better in the bubble shape
          const centerOffsetY = -size * 0.1; // Move up slightly in the bubble
          
          // Set initial positions in a circle
          const x = Math.cos(angle) * radius + centerOffsetX;
          const y = Math.sin(angle) * radius + centerOffsetY;
          
          // Calculate font size based on word weight/size
          const minFontSize = 12;
          const maxFontSize = 28;
          const fontSize = minFontSize + (word.size / 100) * (maxFontSize - minFontSize);
          
          return (
            <Animated.Text
              key={word.id}
              style={[
                styles.word,
                {
                  fontSize,
                  color: word.color,
                  fontWeight: fontSize > 18 ? 'bold' : 'normal',
                  textShadowColor: 'rgba(255,255,255,0.8)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 3,
                  left: size / 2 + x - fontSize * word.text.length / 4, // Center horizontally
                  top: size / 2 + y - fontSize / 2, // Center vertically
                },
                animatedStyle,
              ]}
            >
              {word.text}
            </Animated.Text>
          );
        })}
      </Animated.View>

      {/* Title */}
      {title && (
        <Text style={styles.title}>
          {title}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  bubbleContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  word: {
    position: 'absolute',
    textAlign: 'center',
    zIndex: 10,
    fontWeight: 'bold',
  },
  title: {
    position: 'absolute',
    bottom: -40,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
    width: width * 0.8,
  },
}); 