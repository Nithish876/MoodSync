TypeScript implementation with animated words that move in random directions and vary in size:

```
// WordCloud.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions, StyleSheet } from 'react-native';

interface Word {
  text: string;
  size: number;
  color: string;
  position: {
    x: Animated.Value;
    y: Animated.Value;
  };
}

interface WordCloudProps {
  words: string[];
  colors?: string[];
}

const { width, height } = Dimensions.get('window');

const WordCloud: React.FC<WordCloudProps> = ({
  words,
  colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD']
}) => {
  const animatedWords = useRef<Word[]>([]);

  useEffect(() => {
    // Initialize animated words
    animatedWords.current = words.map((text) => ({
      text,
      size: Math.random() * 20 + 14, // Random size between 14 and 34
      color: colors[Math.floor(Math.random() * colors.length)],
      position: {
        x: new Animated.Value(Math.random() * width),
        y: new Animated.Value(Math.random() * height * 0.6),
      },
    }));

    // Animate words
    const animate = () => {
      const animations = animatedWords.current.map((word) => {
        const newX = Math.random() * width;
        const newY = Math.random() * height * 0.6;
        const duration = Math.random() * 3000 + 2000;

        return Animated.parallel([
          Animated.timing(word.position.x, {
            toValue: newX,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(word.position.y, {
            toValue: newY,
            duration,
            useNativeDriver: true,
          }),
        ]);
      });

      Animated.parallel(animations).start(() => animate());
    };

    animate();
  }, [words, colors]);

  return (
    <View style={styles.container}>
      {animatedWords.current.map((word, index) => (
        <Animated.Text
          key={`${word.text}-${index}`}
          style={[
            styles.word,
            {
              fontSize: word.size,
              color: word.color,
              transform: [
                { translateX: word.position.x },
                { translateY: word.position.y },
              ],
            },
          ]}
        >
          {word.text}
        </Animated.Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  word: {
    position: 'absolute',
    fontWeight: 'bold',
  },
});

export default WordCloud;

// Usage example in App.tsx:
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import WordCloud from './WordCloud';

const App = () => {
  const sampleWords = [
    'React',
    'Native',
    'TypeScript',
    'Animation',
    'Cloud',
    'Mobile',
    'App',
    'Development',
    'Expo',
    'JavaScript',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <WordCloud words={sampleWords} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;

```

Key features of this implementation:

Words move randomly across the screen with smooth animations
Each word has:

Random size between 14 and 34
Random color from the provided color palette
Continuous movement in random directions
Independent animation timing

The component is customizable with:

Custom word list
Custom color palette
Adjustable animation speeds
Configurable font sizes

To modify the behavior, you can:

Adjust the animation duration in the duration variable
Change the font size range by modifying the size calculation
Add more colors to the default colors array
Adjust the movement area by modifying the width and height multipliers
