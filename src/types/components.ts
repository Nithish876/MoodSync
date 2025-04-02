import type { EmojiMood, SavedWordCloud } from './mood';

export interface ColorMixerHandle {
  getMoodData: () => EmojiMood[];
  hideSaveButton?: boolean;
}

export interface WordCloudHandle {
  getWordCloudData: () => SavedWordCloud;
  hideSaveButton?: boolean;
} 