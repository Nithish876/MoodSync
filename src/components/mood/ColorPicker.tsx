import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const COLORS = [
  '#FF6B6B', '#FF9E7D', '#FFBE7D', '#FFF27D', 
  '#B8FF7D', '#7DFFE1', '#7DC0FF', '#7D7DFF',
  '#BE7DFF', '#FF7DF3', '#FF7D9E', '#4ECDC4',
  '#FFD166', '#06D6A0', '#118AB2', '#EF476F',
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onColorSelect }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        {COLORS.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorOption,
              { backgroundColor: color },
              selectedColor === color && styles.selectedColor
            ]}
            onPress={() => onColorSelect(color)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    paddingVertical: 10,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#333',
  },
}); 