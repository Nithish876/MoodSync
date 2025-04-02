import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { EMOJI_OPTIONS } from '../../constants/emojis';

// Sample color options for the picker
const COLOR_OPTIONS = [
  '#FF6B6B', '#FF9E7D', '#FFBE7D', '#FFF27D', 
  '#B8FF7D', '#7DFFE1', '#7DC0FF', '#7D7DFF',
  '#BE7DFF', '#FF7DF3', '#FF7D9E', '#4ECDC4',
  '#FFD166', '#06D6A0', '#118AB2', '#EF476F',
  // Add gradient option
  'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)',
];

interface MoodCustomizerProps {
  onSave: (name: string, emoji: string, color: string) => void;
  onCancel: () => void;
  existingCustomEmojis?: {emoji: string, color: string, name: string}[];
}

export const MoodCustomizer = ({ onSave, onCancel, existingCustomEmojis = [] }: MoodCustomizerProps) => {
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJI_OPTIONS[0].emoji);
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [customEmoji, setCustomEmoji] = useState('');
  const [showCustomEmojiInput, setShowCustomEmojiInput] = useState(false);

  const handleSave = () => {
    const finalEmoji = customEmoji.trim() || selectedEmoji;
    const finalName = name.trim() || 'Custom Mood';
    onSave(finalName, finalEmoji, selectedColor);
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Customize Your Mood</Text>
          </View>

          <View style={styles.previewContainer}>
            <View style={[styles.previewBubble, { backgroundColor: selectedColor }]}>
              <Text style={styles.previewEmoji}>{showCustomEmojiInput && customEmoji ? customEmoji : selectedEmoji}</Text>
            </View>
            <Text style={styles.previewName}>{name || 'Custom Mood'}</Text>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Please enter the name for this mood"
              placeholderTextColor="#999"
              maxLength={10}
            />
            <Text style={styles.charLimit}>{name.length}/10</Text>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Emoji</Text>
            
            {showCustomEmojiInput ? (
              <View style={styles.customEmojiContainer}>
                <TextInput
                  style={styles.customEmojiInput}
                  value={customEmoji}
                  onChangeText={setCustomEmoji}
                  placeholder="Enter emoji"
                  maxLength={2}
                />
                <TouchableOpacity 
                  style={styles.customEmojiButton}
                  onPress={() => setShowCustomEmojiInput(false)}
                >
                  <Text>Use Preset</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.emojiGrid}>
                    {EMOJI_OPTIONS.map(({ emoji }) => (
                      <TouchableOpacity
                        key={emoji}
                        style={[
                          styles.emojiOption,
                          selectedEmoji === emoji && styles.selectedEmojiOption
                        ]}
                        onPress={() => setSelectedEmoji(emoji)}
                      >
                        <Text style={styles.emojiText}>{emoji}</Text>
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                      style={styles.customEmojiAddButton}
                      onPress={() => setShowCustomEmojiInput(true)}
                    >
                      <Text style={styles.customEmojiAddText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            )}
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Color</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.colorGrid}>
                {COLOR_OPTIONS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color && styles.selectedColorOption
                    ]}
                    onPress={() => setSelectedColor(color)}
                  />
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  previewBubble: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  previewEmoji: {
    fontSize: 30,
  },
  previewName: {
    fontSize: 16,
    fontWeight: '500',
  },
  inputSection: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: '#555',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  charLimit: {
    alignSelf: 'flex-end',
    color: '#999',
    fontSize: 12,
    marginTop: 5,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  emojiOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#F2F2F2',
  },
  selectedEmojiOption: {
    borderWidth: 2,
    borderColor: '#4ECDC4',
    backgroundColor: '#E6F7F5',
  },
  emojiText: {
    fontSize: 24,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#4ECDC4',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  customEmojiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  customEmojiInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 10,
    fontSize: 20,
    width: 70,
    textAlign: 'center',
    marginRight: 10,
  },
  customEmojiButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  customEmojiAddButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  customEmojiAddText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
}); 