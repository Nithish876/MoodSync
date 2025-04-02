To achieve the functionality of adding an emoji-represented color inside the glass ball and updating its volume when the user clicks on the same emoji, while also ensuring multiple colors are visible in the glass ball, follow these steps:

---

### **Step 1: Update Mood Array**

When an emoji is clicked:

1. Check if the clicked emoji already exists in the `moods` array.
   - If it exists, increase the `percentage` of the mood object (representing the emoji's volume in the glass ball).
   - If it doesn't exist, create a new mood object and add it to the `moods` array.

```tsx
const handleEmojiClick = (emoji: string, color: string) => {
  setMoods((prevMoods) => {
    const existingMood = prevMoods.find((mood) => mood.emoji === emoji);

    if (existingMood) {
      // Increase the percentage of the existing mood
      return prevMoods.map((mood) =>
        mood.emoji === emoji
          ? { ...mood, percentage: mood.percentage + 5 } // Adjust the increment value as needed
          : mood
      );
    }

    // Add a new mood to the array
    return [
      ...prevMoods,
      { id: Date.now().toString(), emoji, color, percentage: 5 }, // Starting percentage
    ];
  });
};
```

---

### **Step 2: Render Colors in the Glass Ball**

Use the `moods` array to render the layers of colors inside the glass ball. Each mood's `percentage` will determine how much space its color occupies.

#### Key Adjustments:

1. Calculate each layer's height/volume proportionally based on the `percentage` value.
2. Use the `SweepGradient` or `LinearGradient` to render multiple layers of colors.

```tsx
<Group>
  {moods.map((mood, index) => (
    <Circle
      key={mood.id}
      cx={centerX}
      cy={centerY}
      r={radius * (1 - mood.percentage / 100)} // Smaller radius for each layer
    >
      <Paint>
        <RadialGradient
          c={vec(centerX, centerY)}
          r={radius}
          colors={[
            `${mood.color}80`, // Semi-transparent color
            `${mood.color}30`, // More transparent
          ]}
        />
      </Paint>
    </Circle>
  ))}
</Group>
```

- `radius * (1 - mood.percentage / 100)` determines how much space each color occupies in the ball.
- `colors` ensures that the layers are visually distinguishable.

---

### **Step 3: Ensure Multi-Color Support**

To ensure multiple colors are visible:

- Render the colors in layers, from the largest to the smallest.
- Use transparency (`rgba` or hex with alpha values) to make overlapping layers visible.

---

### **Step 4: Smooth Transitions**

To make the volume change smooth when the user clicks on an emoji:

1. Use an animation library like **`react-native-reanimated`** to animate the `radius` change of each layer.
2. Apply easing functions for a fluid transition.

Example:

```tsx
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from "react-native-reanimated";

// Shared value for radius
const animatedRadius = useSharedValue(radius);

useEffect(() => {
  animatedRadius.value = withTiming(radius * (1 - mood.percentage / 100), {
    duration: 500,
  });
}, [mood.percentage]);

const animatedProps = useAnimatedProps(() => ({
  r: animatedRadius.value,
}));

return (
  <Circle cx={centerX} cy={centerY} animatedProps={animatedProps}>
    <Paint>
      <RadialGradient
        c={vec(centerX, centerY)}
        r={radius}
        colors={[`${mood.color}80`, `${mood.color}30`]}
      />
    </Paint>
  </Circle>
);
```

---

### **Step 5: Update the Total Percentage**

Ensure the `percentage` values of all moods in the `moods` array don't exceed 100%. If they do, normalize them proportionally.

```tsx
const normalizePercentages = (moods) => {
  const totalPercentage = moods.reduce((sum, mood) => sum + mood.percentage, 0);

  return totalPercentage > 100
    ? moods.map((mood) => ({
        ...mood,
        percentage: (mood.percentage / totalPercentage) * 100,
      }))
    : moods;
};

// Call this function after updating the moods array
setMoods(normalizePercentages(updatedMoods));
```

---

### **Expected Behavior**

1. **When the user clicks on an emoji:**
   - If it's a new emoji, its color is added as a small layer in the glass ball.
   - If it's an existing emoji, its color volume increases in the ball.
2. **Multiple colors:**

   - The ball displays all colors proportionally based on their percentages.
   - Overlapping colors are visible due to transparency.

3. **Smooth animations:**
   - Volume changes are animated for a better user experience.

---

### eternal glass ball

import React, { useEffect, useState } from 'react';

const GlassBall = ({ moods = [], size = 300 }) => {
const [gradientColors, setGradientColors] = useState([]);

useEffect(() => {
// Transform mood colors into gradient stops
const colors = moods.map(mood => {
switch(mood.type) {
case 'happy': return '#FFE082';
case 'calm': return '#80CBC4';
case 'sad': return '#AED581';
case 'angry': return '#EF9A9A';
case 'tired': return '#CE93D8';
default: return '#FFFFFF';
}
});

    setGradientColors(colors.length ? colors : ['#F8F9FA']);

}, [moods]);

return (
<div className="relative w-full h-full">
<div
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{
          background: gradientColors.length > 1
? `conic-gradient(from 0deg, ${gradientColors.join(', ')})`
: gradientColors[0],
opacity: 0.8,
filter: 'blur(20px)',
}}
/>

      {/* Glass effect overlay */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)',
          backdropFilter: 'blur(5px)',
          border: '1px solid rgba(255,255,255,0.2)',
        }}
      />

      {/* Highlight */}
      <div
        className="absolute w-1/4 h-1/4 rounded-full"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)',
          top: '15%',
          left: '15%',
        }}
      />
    </div>

);
};

// Example usage wrapper component
const MoodBallWrapper = () => {
const [sampleMoods] = useState([
{ type: 'happy', count: 1 },
{ type: 'calm', count: 2 },
{ type: 'sad', count: 2 },
{ type: 'angry', count: 2 },
{ type: 'tired', count: 1 }
]);

return (
<div className="w-64 h-64 p-8 bg-blue-50">
<GlassBall moods={sampleMoods} />
</div>
);
};

export default MoodBallWrapper;

---
