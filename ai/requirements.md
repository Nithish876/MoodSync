# MoodBubble App - Requirements Document

## Project Overview

This is a cross-platform app used by friends or couples to share their daily current mood in two ways:

1. Mood Bubble Feature:

   - Users can add multiple emojis inside a glass bubble
   - Each emoji has its own color
   - Same emoji can be selected multiple times
   - Colors mix based on selected emojis
   - Liquid animation effect in transparent bubble
   - Color state changes visible to friends/couples
   - Offline animation support

   2. Glass Ball Specifications
      Visual Properties

A transparent spherical container that transforms emojis into flowing, mixing liquid colors inside the spherical container.
Core Features:
Visual Container
Transparent glass sphere
Reflective/refractive properties to give depth
Visible from both light and dark backgrounds
Emoji Transformation
Users can input emojis
Each emoji converts into its corresponding color liquid
Example: Red heart emoji (❤️) becomes flowing red liquid
Liquid Behavior
Colors maintain their distinct properties initially
Fluids move and mix continuously like oil paints
Movement appears natural and organic
Offline animation (no server-side calculations needed)
Non-synchronized (each user sees their own unique mixing pattern)
Technical Considerations for React Native Expo:
Rendering Options
React Native Skia for high-performance 2D graphics
Three.js with React Three Fiber for 3D effects
React Native Canvas for 2D animations
Animation Properties

Continuous swirling motion
Organic fluid behavior
Particle-based color mixing
Non-synchronized patterns
Offline animation capability

Color Management

Colors maintain initial distinctness
Gradual blending over time
Percentage-based color distribution
Dynamic color addition through '+' button

Technical Implementation

1.  Required Packages
    jsonCopy{
    "dependencies": {
    "@shopify/react-native-skia": "^0.1.241",
    "react-native-reanimated": "^3.5.4",
    "@react-navigation/native": "^6.0.0",
    "react-native-async-storage": "^1.21.0"
    }
    }
2.  Core Data Structures
    typescriptCopyinterface MoodColor {
    id: string;
    color: string;
    percentage: number;
    }

interface GlassBallState {
colors: MoodColor[];
text: string;
timestamp: Date;
} 3. Animation Implementation
Glass Ball Component
typescriptCopy// Key animation hooks
const clock = useClockValue();
const swirl = useComputedValue(() => {
// Swirl animation calculation
}, [clock]);

// Render properties

- Transparent base
- Edge highlights
- Color mixing
- Particle effects

4.  Performance Optimization
    Hardware Acceleration

Enable GPU rendering
Implement frame limiting
Optimize particle system
Memory management for animations

Storage Strategy

Local storage for color data
Async storage for persistence
Efficient state management

2. Word Cloud Feature:
   - 5 blank text boxes for short mood descriptions
   - Forms a word cloud visualization
   - Visible to friends/couples

Widget Integration:

- Two main sections:
  1. Personal mood section (add & view own mood)
  2. Friend's mood section (view & react to friend's mood)
- Future feature: notifications for reactions (not implemented now)

## User Flow

### Launch & Authentication

1. Splash screen (2 seconds)
2. Login screen with:
   -guest account with firebase auth

### Navigation Structure

Bottom navigation with three buttons:

1. Left: Widget Screen
2. Center: Home/Mood Screen
3. Right: Profile Screen

### Screen Details

1. Home Screen (Mood Entry)

   - Color mix card with glass bubble
   - Swipe/arrow navigation to word cloud card
   - Word cloud input with 5 text boxes

2. Profile Screen

   - Display profile picture & name
   - Show unique friend code
   - Share/invite link functionality
   - Friends list management
   - (Future features marked as pending:
     - Couple list
     - Mood history
     - Mood calendar
     - Achievement map)

3. Widget Screen
   - Add single widget option (personal/friend mood)
   - Add combined widget option (both moods)
   - Widget preview
   - Home screen widget management

## Technical Implementation

### Project Setup

```bash

# Core dependencies
npx expo install @react-navigation/native @react-navigation/bottom-tabs
npx expo install expo-auth-session expo-random expo-web-browser
npx expo install @react-native-async-storage/async-storage
npx expo install firebase react-native-reanimated
```

### File Structure

```
project-root/
├── src/
│ ├── assets/
│ │ ├── images/
│ │ ├── icons/
│ │ └── fonts/
│ │
│ ├── components/
│ │ ├── shared/
│ │ │ ├── Button.tsx
│ │ │ └── Card.tsx
│ │ ├── widget/
│ │ │ ├── WidgetActions.tsx
│ │ │ └── WidgetDisplay.tsx
│ │ └── mood/
│ │ ├── ColorMixer.tsx
│ │ └── WordCloud.tsx
│ │
│ ├── hooks/
│ │ ├── useAuth.ts
│ │ ├── useMood.ts
│ │ └── useWidget.ts
│ │
│ ├── navigation/
│ │ ├── AppNavigator.tsx
│ │ ├── AuthNavigator.tsx
│ │ └── types.ts
│ │
│ ├── screens/
│ │ ├── auth/
│ │ │ └── LoginScreen.tsx
│ │ ├── widget/
│ │ │ └── WidgetSetupScreen.tsx
│ │ └── mood/
│ │ └── MoodEntryScreen.tsx
│ │
│ ├── services/
│ │ ├── firebase/
│ │ │ ├── config.ts
│ │ │ ├── auth.ts
│ │ │ └── db.ts
│ │ ├── widget/
│ │ │ ├── ios.ts
│ │ │ └── android.ts
│ │ └── api/
│ │ └── index.ts
│ │
│ ├── store/
│ │ ├── slices/
│ │ │ ├── authSlice.ts
│ │ │ └── moodSlice.ts
│ │ └── index.ts
│ │
│ ├── types/
│ │ ├── mood.ts
│ │ └── widget.ts
│ │
│ └── utils/
│ ├── deepLink.ts
│ └── notifications.ts
│
├── App.tsx
├── app.json
├── babel.config.js
├── tsconfig.json
└── package.json
```

### Data Structures

```typescript
// Core Types
interface MoodBubble {
  emojis: Array<{
    type: string;
    color: string;
    position: number;
  }>;
  mixedColor: string;
  lastUpdated: number;
}

interface WordCloud {
  entries: Array<{
    text: string;
    position: number;
  }>;
  lastUpdated: number;
}

// Firebase Schema
interface User {
  id: string;
  name: string;
  profilePicture?: string;
  friendCode: string;
  friends: string[];
  currentMood?: {
    bubble?: MoodBubble;
    wordCloud?: WordCloud;
  };
}
```

### Tech Stack

- React Native with Expo
- TypeScript
- Firebase (Authentication & Realtime Database)
- React Navigation

3. Mood Features

   - Implement bubble component
   - Add emoji selector
   - Create word cloud input
   - Test each feature

4. Friend System

   - Implement friend code generation
   - Add friend connection flow
   - Test real-time updates

5. Widget System
   - Create widget components
   - Implement widget management
   - Test widget updates

## MY Credtentials

# Expo

this are my expo project info
owner "moodsync"
slug "moodsync"
project id "aa97eeea-cd47-4c8e-8b9c-0505aa12208c"

# Firebase

web app
const firebaseConfig = {
apiKey: "AIzaSyD-aN5SXO1EjpSMfWs2V6GudAdkXFiA6qE",
authDomain: "mood-sync-app.firebaseapp.com",
projectId: "mood-sync-app",
storageBucket: "mood-sync-app.firebasestorage.app",
messagingSenderId: "733031349243",
appId: "1:733031349243:web:b71eb7f50fa6414371e95e",
measurementId: "G-86SD9QVKPV"
};

apple app
Bundle ID: com.moodsync.app
App ID: 1:733031349243:ios:0d2b9f09dc55ed8971e95e
android app
bundle id: com.moodsync.app

Google auth credentials
project number: 431604885711
project ID: mood-sync-448111

Google Auth

Client ID Android: 431604885711-qlf4gvk6ais0r548iqibfre7mgf5hecb.apps.googleusercontent.com

Client ID iOS: 431604885711-fj8i5sdfpghv6sqajnqmu5l32fi81iaj.apps.googleusercontent.com

Client ID Web: 431604885711-dv9klfhvh6mgpklcj5dqbguv032adggq.apps.googleusercontent.com

### UI/UX Notes

- Focus on functionality first
- Keep UI simple initially
- Use mockup screenshots as reference
- Figma designs will be added later

### Testing Instructions

- Test each feature after implementation
- Use `npx expo start` frequently
- Verify real-time updates
- Test cross-platform compatibility

### Development Rules

1. All new components go in components folder
2. All new screens go in screens folder
3. All new services go in services folder
4. All new types go in types folder
5. All new utils go in utils folder
