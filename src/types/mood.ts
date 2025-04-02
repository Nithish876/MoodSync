export interface EmojiOption {
  id: string;
  emoji: string;
  label: string;
  color: string;
  name: string;
}

export interface EmojiMood {
  id: string;
  emoji: string;
  color: string;
  percentage: number;
  volume: number;
  timestamp: number;
  name?: string;
}

export interface WordEntry {
  id: string;
  text: string;
  size: number;
  color: string;
}

export interface WordCloudSummary {
  title: string;
  mainWords: string;
  wordCount: number;
}

// Base interface for saved data
interface SavedMoodBase {
  userId: string;
  friendCode?: string;
  timestamp: number;
}

export interface SavedWordCloud extends SavedMoodBase {
  title: string;
  words: WordEntry[];
  summary?: WordCloudSummary; // For easier widget access
}

export interface SavedColorMix extends SavedMoodBase {
  moods: EmojiMood[];
  summary?: string;
} 