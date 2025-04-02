import type { EmojiOption } from '../types/mood';

export const EMOJI_OPTIONS: EmojiOption[] = [
  { id: 'love', emoji: '❤️', color: '#FF5A5A', name: 'Love', label: 'Love' },
  { id: 'excitement', emoji: '🤩', color: '#FFD700', name: 'Excitement', label: 'Excitement' },
  { id: 'jealousy', emoji: '😠', color: '#FF7043', name: 'Jealousy', label: 'Jealousy' },
  { id: 'security', emoji: '🤗', color: '#90CAF9', name: 'Security', label: 'Security' },
  { id: 'frustration', emoji: '😤', color: '#F44336', name: 'Frustration', label: 'Frustration' },
  { id: 'longing', emoji: '🥺', color: '#A1887F', name: 'Longing', label: 'Longing' },
  { id: 'passion', emoji: '🔥', color: '#FF5722', name: 'Passion', label: 'Passion' },
  { id: 'flirty', emoji: '😏', color: '#BA68C8', name: 'Flirty', label: 'Flirty' },
  { id: 'teasing', emoji: '👀', color: '#5C6BC0', name: 'Teasing', label: 'Teasing' },
  { id: 'romantic', emoji: '💋', color: '#EC407A', name: 'Romantic', label: 'Romantic' },
  { id: 'contentment', emoji: '😊', color: '#66BB6A', name: 'Contentment', label: 'Contentment' },
  { id: 'naughty', emoji: '😈', color: '#7E57C2', name: 'Naughty', label: 'Naughty' },
];

export const moodDescriptions = {
  '❤️': 'Deep affection and connection',
  '🤩': 'Thrill of being together',
  '😠': 'Fear of losing them',
  '🤗': 'Feeling safe and trusted',
  '😤': 'Annoyance or conflict',
  '🥺': 'Missing each other',
  '🔥': 'Pure passion',
  '😏': 'Smug flirtiness',
  '👀': 'Suggestive teasing',
  '💋': 'Romantic seduction',
  '😊': 'Feeling content and happy',
  '😈': 'Feeling mischievous'
}; 