export interface MoodBubble {
  emoji: string;
  color: string;
  timestamp: number;
}

export interface WordCloud {
  words: string[];
  title: string;
  timestamp: number;
}

export interface User {
  id: string;
  name: string;
  friendCode: string;
  friends: string[];
  email?: string;
  photoURL?: string;
  currentMood?: {
    bubble?: MoodBubble;
    wordCloud?: WordCloud;
  };
}

export interface UserData {
  id: string;
  email: string | null;
  displayName: string;
  friendCode: string;
  friends: string[];
  createdAt: number;
  updatedAt: number;
}

export interface AuthUser {
  uid: string;
  email: string | null;
} 