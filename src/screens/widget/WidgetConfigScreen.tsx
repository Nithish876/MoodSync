import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  NativeModules,
  Switch,
  Button,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { NativeEventEmitter } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { prepareFriendWidgetData } from '../../utils/friendData';
import { updateWidgetConfig, getWidgetConfig } from '../../utils/widgetHelpers';
import { updateFriendColorMood, refreshAllWidgets } from '../../utils/widgetHelpers';
import { SavedColorMix } from '../../types/mood';

const { WidgetConfigModule } = NativeModules;

type RootStackParamList = {
  WidgetConfig: {
    widgetId: number;
    widgetType: string;
  };
};

interface WidgetInfo {
  widgetId: number;
  widgetType: string;
  isOwnMood: boolean;
  friendId: string | null;
  friendName: string | null;
}

interface FriendData {
  id: string;
  name: string;
  email: string;
}

export const WidgetConfigScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'WidgetConfig'>>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [widgetInfo, setWidgetInfo] = useState<WidgetInfo | null>(null);
  const [friends, setFriends] = useState<FriendData[]>([]);
  const [isOwnMood, setIsOwnMood] = useState(true);
  const [selectedFriend, setSelectedFriend] = useState<FriendData | null>(null);
  const [widgetType, setWidgetType] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Parse widget ID and type from route params
  const widgetId = route.params.widgetId;
  const widgetTypeFromParams = route.params.widgetType;
  
  useEffect(() => {
    const loadData = async () => {
      if (!widgetId || !user) return;
      
      try {
        setLoading(true);
        
        // Load friends list first
        await loadFriends();
        
        // Then load widget info
        try {
          const info = await WidgetConfigModule.getWidgetInfo(widgetId);
          setWidgetInfo({
            widgetId,
            widgetType: widgetTypeFromParams,
            ...info
          });
          
          // Set initial state based on current config
          setIsOwnMood(info.isOwnMood);
          setSelectedFriend(info.friendId ? friends.find(f => f.id === info.friendId) || null : null);
        } catch (widgetError) {
          console.error('Error loading widget info:', widgetError);
          // Continue with default values if widget info fails
          setWidgetInfo({
            widgetId,
            widgetType: widgetTypeFromParams,
            isOwnMood: true,
            friendId: null,
            friendName: null
          });
        }
      } catch (error) {
        console.error('Error loading widget config:', error);
        Alert.alert('Error', 'Failed to load widget configuration');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [widgetId, user]);
  
  const loadFriends = async () => {
    try {
      setLoading(true);
      
      if (!user?.uid) {
        console.error("User not authenticated");
        throw new Error("User not authenticated");
      }
      
      // Get current user's profile from Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (!userDocSnap.exists()) {
        throw new Error("User profile not found");
      }
      
      const userData = userDocSnap.data();
      const friendIds = userData.friends || [];
      
      if (friendIds.length === 0) {
        setFriends([]);
        return;
      }
      
      // Fetch friend details directly from Firestore
      const friendPromises = friendIds.map((friendId: string) => 
        getDoc(doc(db, 'users', friendId))
      );
      
      const friendSnapshots = await Promise.all(friendPromises);
      const friendData = friendSnapshots
        .filter(snap => snap.exists())
        .map(snap => ({
          id: snap.id,
          name: snap.data().name || 'Unknown',
          email: snap.data().email || ''
        }));
      
      setFriends(friendData);
      
    } catch (error: unknown) {
      console.error("Error loading friends:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      Alert.alert("Error", "Failed to load widget config: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const toggleMoodType = (value: boolean) => {
    setIsOwnMood(value);
    // Clear selected friend when switching to own mood
    if (value) {
      setSelectedFriend(null);
    }
  };
  
  const saveWidgetConfig = async () => {
    try {
      setIsSaving(true);
      
      if (!widgetInfo) return;
      
      // Create config object
      const config: Record<string, any> = {
        isOwnMood,
        widgetType: widgetType || route.params.widgetType,
      };
      
      // Add friend info if selected
      if (!isOwnMood && selectedFriend) {
        config.friendId = selectedFriend.id;
        config.friendName = selectedFriend.name;
        config.friendEmail = selectedFriend.email;
      }
      
      console.log(`Saving widget config for widget ID: ${widgetId}, config:`, config);
      
      // Use our safe utility function
      await updateWidgetConfig(widgetId, config);
      
      // If showing a friend's data, prepare it
      if (!isOwnMood && selectedFriend) {
        try {
          // Get the friend's mood data from Firestore
          const friendColorMixRef = doc(db, 'colorMixes', selectedFriend.id);
          const friendColorMixSnap = await getDoc(friendColorMixRef);
          
          if (friendColorMixSnap.exists()) {
            const colorMixData = friendColorMixSnap.data() as SavedColorMix;
            console.log(`Friend ${selectedFriend.name} color mix data:`, colorMixData);
            
            // Update widgets with friend data using proper method
            await updateFriendColorMood(
              selectedFriend.id,
              selectedFriend.name,
              colorMixData
            );
            
            console.log('Friend mood data updated in widgets');
          } else {
            console.log(`No mood data found for friend ${selectedFriend.name}`);
          }
        } catch (error) {
          console.error('Error updating friend widget data:', error);
        }
      }
      
      // Force refresh all widgets
      await refreshAllWidgets();
      
      console.log('Widget configuration saved successfully');
      
      // Go back to previous screen or show success
      navigation.goBack();
    } catch (error) {
      console.error('Error saving widget configuration:', error);
      Alert.alert('Error', 'Failed to save widget configuration');
    } finally {
      setIsSaving(false);
    }
  };
  
  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.DeviceEventEmitter);
    const subscription = eventEmitter.addListener('openWidgetConfig', (event) => {
        const widgetId = event.widgetId;
        // Load widget configuration
        loadWidgetConfig();
    });

    return () => subscription.remove();
  }, []);
  
  const loadWidgetConfig = async () => {
    if (!widgetId) {
      console.log('No widget ID provided');
      return;
    }
    
    try {
      setLoading(true);
      
      console.log(`Loading configuration for widget ID: ${widgetId}`);
      
      // Use our safe utility function
      const config = await getWidgetConfig(widgetId);
      
      console.log('Widget configuration loaded:', config);
      
      setWidgetInfo(config);
      setWidgetType(config.widgetType || widgetTypeFromParams);
      setIsOwnMood(config.isOwnMood !== false);
      
      if (config.friendId && config.friendName) {
        setSelectedFriend({
          id: config.friendId,
          name: config.friendName,
          email: config.friendEmail || '',
        });
      }
    } catch (error) {
      console.error('Error loading widget configuration:', error);
      Alert.alert('Error', 'Failed to load widget configuration');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading widget settings...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const getWidgetTypeLabel = () => {
    switch (widgetInfo?.widgetType) {
      case 'small_color': return 'Small Color Widget';
      case 'small_word': return 'Small Word Widget';
      case 'large_color': return 'Large Color Widget';
      case 'large_word': return 'Large Word Widget';
      default: return 'Widget';
    }
  };
  
  const renderItem = (item: FriendData) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.name}</Text>
      </View>
    );
  };

  const onChange = (item: FriendData) => {
    setSelectedFriend({
      id: item.id,
      name: item.name,
      email: item.email
    });
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configure Widget</Text>
        <View style={styles.backButton} />
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          <Text style={styles.widgetTitle}>{getWidgetTypeLabel()}</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Widget Shows:</Text>
            <View style={styles.optionsContainer}>
              <TouchableOpacity 
                style={[styles.option, isOwnMood && styles.selectedOption]} 
                onPress={() => toggleMoodType(true)}
              >
                <View style={styles.radioContainer}>
                  <View style={[styles.radioOuter, isOwnMood && styles.radioOuterSelected]}>
                    {isOwnMood && <View style={styles.radioInner} />}
                  </View>
                  <Text style={[styles.optionText, isOwnMood && styles.selectedOptionText]}>My Mood</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.option, !isOwnMood && styles.selectedOption]} 
                onPress={() => toggleMoodType(false)}
              >
                <View style={styles.radioContainer}>
                  <View style={[styles.radioOuter, !isOwnMood && styles.radioOuterSelected]}>
                    {!isOwnMood && <View style={styles.radioInner} />}
                  </View>
                  <Text style={[styles.optionText, !isOwnMood && styles.selectedOptionText]}>Friend's Mood</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          
          {!isOwnMood && (
            <View style={styles.friendsSection}>
              <Text style={styles.sectionTitle}>Select a friend:</Text>
              
              {friends.length === 0 ? (
                <Text style={styles.noFriendsText}>
                  You don't have any friends added yet. Add friends from your profile screen.
                </Text>
              ) : (
                <ScrollView style={styles.friendsList}>
                  {friends.map(friend => (
                    <TouchableOpacity
                      key={friend.id}
                      style={[
                        styles.friendItem,
                        selectedFriend?.id === friend.id && styles.friendItemSelected
                      ]}
                      onPress={() => setSelectedFriend(friend)}
                    >
                      <View style={styles.friendAvatar}>
                        <Text style={styles.friendInitial}>
                          {friend.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.friendInfo}>
                        <Text style={styles.friendName}>{friend.name}</Text>
                        <Text style={styles.friendEmail}>{friend.email}</Text>
                      </View>
                      {selectedFriend?.id === friend.id && (
                        <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          )}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={saveWidgetConfig}
          disabled={!selectedFriend && !isOwnMood}
        >
          <Text style={styles.saveButtonText}>Save Configuration</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  widgetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
  },
  selectedOption: {
    backgroundColor: '#e1f5fe',
    borderColor: '#007AFF',
    borderWidth: 1,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  friendsSection: {
    marginBottom: 16,
  },
  noFriendsText: {
    textAlign: 'center',
    padding: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
  },
  friendItemSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196F3',
    borderWidth: 1,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  friendInitial: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  friendEmail: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 15,
  },
  item: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
  },
  friendsList: {
    maxHeight: 200,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#888',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioOuterSelected: {
    borderColor: '#2196F3',
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#2196F3',
  },
}); 