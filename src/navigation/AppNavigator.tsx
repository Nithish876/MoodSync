import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LoginScreen } from '../screens/login/LoginScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { MoodEntryScreen } from '../screens/mood/MoodEntryScreen';
import { WidgetScreen } from '../screens/widget/WidgetScreen';
import { WidgetConfigScreen } from '../screens/widget/WidgetConfigScreen';
import { useAuth } from '../contexts/AuthContext';
import { NativeEventEmitter, NativeModules, Platform, DeviceEventEmitter, AppState } from 'react-native';
import { useNavigation, NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { refreshAllFriendWidgetData } from '../utils/widgetHelpers';
import { collection, query, where, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase/config';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Define navigation parameter types
type RootStackParamList = {
  Login: undefined;
  Main: { screen?: string; params?: any };
  WidgetConfigScreen: { widgetId: number; widgetType: string };
};

// Extend navigation props
type AppNavigationProp = NavigationProp<RootStackParamList>;

// Widget event listener for handling widget clicks
function WidgetEventListener() {
  const navigation = useNavigation<AppNavigationProp>();
  
  useEffect(() => {
    // Safely access the widget module and create event emitter
    const widgetModule = Platform.OS === 'android' 
      ? NativeModules.WidgetModule 
      : null;
    
    // Only create event emitter if the module exists
    const eventEmitter = widgetModule 
      ? new NativeEventEmitter(widgetModule)
      : null;
    
    // Listen for widget click events through the eventEmitter
    const widgetEventSubscription = eventEmitter ? 
      eventEmitter.addListener('onWidgetClick', (data) => {
        console.log('Widget clicked:', data);
        if (data.widgetId) {
          navigation.navigate('WidgetConfigScreen', {
            widgetId: data.widgetId,
            widgetType: data.widgetType || 'unknown',
          });
        }
      }) : null;

    // Also listen for direct DeviceEventEmitter events from MainActivity
    const configRequestSubscription = DeviceEventEmitter.addListener(
      'onWidgetConfigRequest', 
      (data) => {
        console.log('Widget config requested:', data);
        if (data.widgetId) {
          navigation.navigate('WidgetConfigScreen', {
            widgetId: data.widgetId,
            widgetType: data.widgetType || 'unknown',
          });
        }
      }
    );
    
    // Cleanup subscriptions on unmount
    return () => {
      widgetEventSubscription?.remove();
      configRequestSubscription.remove();
    };
  }, [navigation]);
  
  return null;
}

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#ff6b6b',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Widget" 
        component={WidgetScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen 
        name="Mood" 
        component={MoodEntryScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          )
        }}
      />
    </Tab.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MainApp" 
        component={AppTabs} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="WidgetConfigScreen" 
        component={WidgetConfigScreen}
        options={{ 
          title: 'Widget Settings',
          presentation: 'modal'
        }}
      />
    </Stack.Navigator>
  );
}

export function RootNavigator() {
  const { user } = useAuth();
  const navigationRef = useNavigationContainerRef<RootStackParamList>();

  // Add widget update and refresh functionality
  useEffect(() => {
    // Declare cleanup functions
    let widgetUpdateCleanup: (() => void) | null = null;
    let refreshInterval: NodeJS.Timeout;
    let backgroundRefreshInterval: NodeJS.Timeout;
    
    // Skip if no user is logged in
    if (!user) return;
    
    // Set up regular refresh of widget data
    const refreshWidgetData = async () => {
      try {
        const { refreshAllFriendWidgetData } = require('../utils/widgetHelpers');
        console.log('Periodic refresh of friend widget data');
        await refreshAllFriendWidgetData();
      } catch (error) {
        console.error('Error during widget refresh:', error);
      }
    };
    
    // Run initial refresh
    refreshWidgetData();
    
    // Set regular refresh interval (2 minutes)
    refreshInterval = setInterval(refreshWidgetData, 2 * 60 * 1000);
    
    // Set more frequent refresh when in background (30 seconds)
    backgroundRefreshInterval = setInterval(() => {
      // Only refresh in background to save battery
      if (AppState.currentState !== 'active') {
        console.log('Background refresh of friend widget data');
        refreshWidgetData();
      }
    }, 30 * 1000);
    
    // Set up real-time widget update listener
    const setupRealTimeUpdates = async () => {
      if (!user) return;
      
      try {
        // Implement the widget update listener directly instead of importing it
        // This avoids the circular dependency issues
        
        // Simple query that doesn't require a composite index
        const widgetUpdatesQuery = query(
          collection(db, 'widgetUpdates'),
          where('friendIds', 'array-contains', user.uid)
        );
        
        // Set up the listener with proper error handling
        const unsubscribeWidgetUpdates = onSnapshot(
          widgetUpdatesQuery,
          {
            next: (snapshot) => {
              snapshot.docChanges().forEach(async (change) => {
                if (change.type === 'added') {
                  const updateData = change.doc.data();
                  
                  // Filter recent updates (last 10 minutes)
                  const tenMinutesAgo = Date.now() - (10 * 60 * 1000);
                  if (updateData.timestamp > tenMinutesAgo && updateData.senderId !== user.uid) {
                    console.log('Friend updated their mood (listener), refreshing widget data');
                    refreshWidgetData();
                  }
                }
              });
            },
            error: (error) => {
              console.error('Widget update listener error:', error);
              
              // If error is about missing index, use simple timer as fallback
              if (error.message && error.message.includes('index')) {
                console.log('Firestore index error, using timer fallback');
                const fallbackInterval = setInterval(() => {
                  console.log('Refreshing widget data via fallback timer');
                  refreshWidgetData();
                }, 60 * 1000); // Every minute
                
                // Return cleanup function
                widgetUpdateCleanup = () => clearInterval(fallbackInterval);
              }
            }
          }
        );
        
        widgetUpdateCleanup = unsubscribeWidgetUpdates;
      } catch (error) {
        console.error('Failed to set up widget update listener:', error);
        
        // Set up a fallback timer if the listener fails completely
        const fallbackInterval = setInterval(() => {
          console.log('Refreshing widget data via emergency fallback timer');
          refreshWidgetData();
        }, 60 * 1000);
        
        widgetUpdateCleanup = () => clearInterval(fallbackInterval);
      }
    };
    
    setupRealTimeUpdates();
    
    // Set up notification listener for widget updates
    let notificationUnsubscribe: (() => void) | null = null;
    
    const setupNotificationListener = async () => {
      if (!user) return;
      
      try {
        // Use imported Firestore functions instead of requiring them
        // Listen for notifications addressed to this user
        const notificationsQuery = query(
          collection(db, 'notifications'),
          where('recipientId', '==', user.uid),
          where('read', '==', false)
        );
        
        notificationUnsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
          snapshot.docChanges().forEach(async (change) => {
            if (change.type === 'added') {
              const notification = change.doc.data();
              
              // If it's a mood update notification, refresh widgets
              if (notification.type === 'mood_update') {
                console.log('Received mood update notification, refreshing widgets');
                refreshWidgetData();
                
                // Mark as read
                try {
                  await updateDoc(change.doc.ref, { read: true });
                } catch (updateError) {
                  console.warn('Failed to mark notification as read:', updateError);
                }
              }
            }
          });
        });
      } catch (error) {
        console.error('Error setting up notification listener:', error);
        
        // Set up a fallback timer if the notification listener fails
        const fallbackInterval = setInterval(() => {
          console.log('Checking for notifications via fallback timer');
          refreshWidgetData();
        }, 2 * 60 * 1000); // Every 2 minutes
        
        notificationUnsubscribe = () => clearInterval(fallbackInterval);
      }
    };
    
    setupNotificationListener();
    
    // Check for pending widget configuration on app start
    if (Platform.OS === 'android') {
      const checkPendingWidgetConfig = async () => {
        try {
          const WidgetModule = NativeModules.WidgetModule;
          if (WidgetModule && WidgetModule.checkPendingWidgetConfig) {
            const result = await WidgetModule.checkPendingWidgetConfig();
            if (result && result.openConfig && navigationRef.current) {
              // Navigate to widget config screen
              navigationRef.current.navigate('Main', {
                screen: 'WidgetConfigScreen',
                params: {
                  widgetId: result.widgetId,
                  widgetType: result.widgetType
                }
              });
            }
          }
        } catch (error) {
          console.error('Error checking pending widget config:', error);
        }
      };
      
      checkPendingWidgetConfig();
    }
    
    // Cleanup all intervals and listeners
    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
      if (backgroundRefreshInterval) clearInterval(backgroundRefreshInterval);
      if (widgetUpdateCleanup) widgetUpdateCleanup();
      if (notificationUnsubscribe) notificationUnsubscribe();
    };
  }, [navigationRef, user]);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainStack} />
        )}
      </Stack.Navigator>
      <WidgetEventListener />
    </NavigationContainer>
  );
} 