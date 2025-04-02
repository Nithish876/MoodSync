import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, NativeModules, Image, DeviceEventEmitter } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../services/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { updateUserColorMixData, updateUserMoodPercentages, refreshAllWidgets } from '../../utils/widgetHelpers';
import { SavedColorMix } from '../../types/mood';

type RootStackParamList = {
  Mood: undefined;
  Widget: undefined;
  WidgetEditScreen: { 
    widgetId: number, 
    widgetType: string,
    moodType: string,
    displayMode: string
  };
};

type WidgetScreenNavigationProp = NavigationProp<RootStackParamList>;

const { WidgetModule } = NativeModules;

export function WidgetScreen() {
  const navigation = useNavigation<WidgetScreenNavigationProp>();
  const { user } = useAuth();
  const [currentMood, setCurrentMood] = useState({ color: '#3498db', text: 'Calm' });

  useEffect(() => {
    // Load current user's mood from Firestore or local storage
    const loadCurrentMood = async () => {
      try {
        if (!user) return;
        
        // Fetch the latest mood data from Firestore
        const colorMixRef = doc(db, 'colorMixes', user.uid);
        const colorMixSnap = await getDoc(colorMixRef);
        
        if (colorMixSnap.exists()) {
          const colorMixData = colorMixSnap.data() as SavedColorMix;
          if (colorMixData.moods && colorMixData.moods.length > 0) {
            // Use the first mood as the current mood display
            const topMood = colorMixData.moods[0];
            setCurrentMood({ 
              color: topMood.color || '#3498db', 
              text: topMood.name || 'Calm'
            });
          }
        }
      } catch (error) {
        console.error('Failed to load current mood:', error);
      }
    };
    
    loadCurrentMood();
    
    // Check for pending widget configuration
    const checkWidgetConfig = async () => {
      try {
        if (WidgetModule && WidgetModule.checkPendingWidgetConfig) {
          const result = await WidgetModule.checkPendingWidgetConfig();
          if (result.openConfig) {
            // Navigate to widget configuration screen
            navigation.navigate('WidgetEditScreen', {
              widgetId: result.widgetId,
              widgetType: result.widgetType,
              // Default values for other parameters
              moodType: 'my',
              displayMode: 'color'
            });
          }
        }
      } catch (error) {
        console.error('Failed to check widget config:', error);
      }
    };

    checkWidgetConfig();
    
    // Add widget click event listener
    const subscription = DeviceEventEmitter.addListener('openWidgetEdit', (data) => {
      // Navigate to widget edit screen with all parameters
      navigation.navigate('WidgetEditScreen', {
        widgetId: data.widgetId,
        widgetType: data.widgetType,
        moodType: data.moodType,
        displayMode: data.displayMode
      });
    });
    
    // Clean up listener when component unmounts
    return () => {
      subscription.remove();
    };
  }, [navigation, user]);

  const handleUpdateMood = () => {
    // Navigate to mood entry screen
    navigation.navigate('Mood');
  };

  const handleAddSmallWidget = async () => {
    try {
      // For 2x2 widget
      if (NativeModules.IntentLauncher && NativeModules.IntentLauncher.openWidgetPicker) {
        await NativeModules.IntentLauncher.openWidgetPicker('small');
      } else {
        showWidgetInstructions();
      }
    } catch (error) {
      console.error('Failed to add small widget:', error);
      showWidgetInstructions();
    }
  };

  const handleAddLargeWidget = async () => {
    try {
      // For 4x2 widget
      if (NativeModules.IntentLauncher && NativeModules.IntentLauncher.openWidgetPicker) {
        await NativeModules.IntentLauncher.openWidgetPicker('large');
      } else {
        showWidgetInstructions();
      }
    } catch (error) {
      console.error('Failed to add large widget:', error);
      showWidgetInstructions();
    }
  };

  const showWidgetInstructions = () => {
    Alert.alert(
      'Add Widget',
      'To add a widget, long press on your home screen, select "Widgets", and look for the MoodSync widgets.',
      [{ text: 'OK' }]
    );
  };

  const showWidgetHelp = () => {
    Alert.alert(
      'Widget Information',
      'MoodSync offers two widget sizes:\n\n' +
      '• 2x2 Widget: Shows either your mood or a friend\'s mood\n' +
      '• 4x2 Widget: Shows both your mood and a friend\'s mood side by side\n\n' +
      'You can tap on any widget to edit its settings.',
      [{ text: 'OK' }]
    );
  };

  const syncWidgetsWithCurrentMood = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      
      // Fetch the latest mood data from Firestore
      const colorMixRef = doc(db, 'colorMixes', user.uid);
      const colorMixSnap = await getDoc(colorMixRef);
      
      if (colorMixSnap.exists()) {
        const colorMixData = colorMixSnap.data() as SavedColorMix;
        
        // Update widgets with this data
        if (WidgetModule) {
          if (WidgetModule.updateUserColorMixData) {
            await WidgetModule.updateUserColorMixData(JSON.stringify(colorMixData));
          }
          if (WidgetModule.updateUserMoodPercentages) {
            await WidgetModule.updateUserMoodPercentages(JSON.stringify(colorMixData));
          }
          if (WidgetModule.forceUpdateAllWidgets) {
            await WidgetModule.forceUpdateAllWidgets();
          }
        }
        
        Alert.alert('Success', 'Widgets updated with your current mood');
      } else {
        Alert.alert('No Data', 'No mood data found to update widgets');
      }
    } catch (error) {
      console.error('Failed to update widgets with current mood:', error);
      Alert.alert('Error', 'Failed to update widgets with your current mood');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Mood Widgets</Text>
        
        <View style={styles.currentMoodContainer}>
          <Text style={styles.sectionTitle}>Current Mood</Text>
          <View style={styles.moodDisplay}>
            <View 
              style={[styles.colorBubble, { backgroundColor: currentMood.color }]} 
            />
            <Text style={styles.moodText}>{currentMood.text}</Text>
          </View>
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdateMood}>
            <Text style={styles.updateButtonText}>Update Mood</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.widgetsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Widget Management</Text>
            <TouchableOpacity onPress={showWidgetHelp}>
              <Ionicons name="information-circle-outline" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.infoText}>
            Add MoodSync widgets to your home screen to quickly view your mood and your friends' moods.
          </Text>
          
          {/* Small Widget Section */}
          <View style={styles.widgetOption}>
            <View style={styles.widgetPreview}>
              <Image 
                source={require('../../../assets/small_widget_preview.png')} 
                style={styles.widgetImage}
                resizeMode="contain"
              />
              <Text style={styles.widgetName}>Small Widget (2×2)</Text>
              <Text style={styles.widgetDescription}>Show your mood or a friend's mood</Text>
            </View>
            <TouchableOpacity 
              style={styles.addWidgetButton} 
              onPress={handleAddSmallWidget}
            >
              <Ionicons name="add-circle-outline" size={20} color="white" />
              <Text style={styles.addWidgetText}>Add to Home Screen</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.divider} />
          
          {/* Large Widget Section */}
          <View style={styles.widgetOption}>
            <View style={styles.widgetPreview}>
              <Image 
                source={require('../../../assets/large_widget_preview.png')} 
                style={styles.widgetImage}
                resizeMode="contain"
              />
              <Text style={styles.widgetName}>Large Widget (4×2)</Text>
              <Text style={styles.widgetDescription}>Show both your mood and a friend's mood</Text>
            </View>
            <TouchableOpacity 
              style={styles.addWidgetButton} 
              onPress={handleAddLargeWidget}
            >
              <Ionicons name="add-circle-outline" size={20} color="white" />
              <Text style={styles.addWidgetText}>Add to Home Screen</Text>
          </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.updateButton} 
          onPress={syncWidgetsWithCurrentMood}
        >
          <Text style={styles.updateButtonText}>Sync Widgets with Current Mood</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  currentMoodContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  moodDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  colorBubble: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  moodText: {
    fontSize: 18,
    fontWeight: '500',
  },
  updateButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  widgetsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  infoText: {
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  widgetOption: {
    marginBottom: 16,
  },
  widgetPreview: {
    alignItems: 'center',
    marginBottom: 12,
  },
  widgetImage: {
    width: '100%',
    height: 120,
    marginBottom: 8,
  },
  widgetName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  widgetDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  addWidgetButton: {
    backgroundColor: '#2ecc71',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addWidgetText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  }
}); 