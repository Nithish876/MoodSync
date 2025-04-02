import React, { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { AuthProvider } from './src/contexts/AuthContext';
import { RootNavigator } from './src/navigation/AppNavigator';
import { refreshAllFriendWidgetData } from './src/utils/widgetHelpers';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { auth, db } from './src/services/firebase/config';
import { initializeMessaging, setupMessagingListeners } from './src/services/firebase/messaging';

export default function App() {
  useEffect(() => {
    // Initialize Firebase messaging for push notifications
    const initMessaging = async () => {
      try {
        const success = await initializeMessaging();
        if (success) {
          console.log('Firebase messaging initialized successfully');
          // Set up listeners once messaging is initialized
          const unsubscribeMessaging = setupMessagingListeners();
          return unsubscribeMessaging;
        }
      } catch (error) {
        console.error('Error initializing Firebase messaging:', error);
      }
    };

    const messagingCleanup = initMessaging();
    
    // Function to refresh all friend widget data
    const refreshFriendData = async () => {
      console.log('App foreground: Refreshing friend widget data');
      await refreshAllFriendWidgetData();
    };
    
    // Initial refresh when app starts
    refreshFriendData();
    
    // Set up periodic refresh (every 2 minutes)
    const refreshInterval = setInterval(() => {
      console.log('Periodic refresh: Checking for friend widget updates');
      refreshFriendData();
    }, 2 * 60 * 1000);
    
    // Set up a more frequent background check (every 30 seconds)
    const backgroundRefreshInterval = setInterval(() => {
      // Only run if app is in background
      if (AppState.currentState !== 'active') {
        console.log('Background refresh: Checking for friend widget updates');
        refreshFriendData();
      }
    }, 30 * 1000);
    
    // Refresh when app comes to foreground
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        console.log('App state changed to active, refreshing friend data');
        refreshFriendData();
      }
    };
    
    // Subscribe to app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    // Set up real-time Firestore listener for widget updates
    let unsubscribeWidgetUpdates: (() => void) | null = null;
    
    const setupWidgetUpdateListener = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;
      
      // Create a query for widget updates where the current user is in the friendIds array
      // and the update is newer than 5 minutes ago (to avoid processing old updates)
      const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
      
      try {
        const widgetUpdatesQuery = query(
          collection(db, 'widgetUpdates'),
          where('friendIds', 'array-contains', currentUser.uid),
          where('timestamp', '>', fiveMinutesAgo),
          orderBy('timestamp', 'desc'),
          limit(10)
        );
        
        // Set up the real-time listener
        unsubscribeWidgetUpdates = onSnapshot(widgetUpdatesQuery, (snapshot) => {
          snapshot.docChanges().forEach(async (change) => {
            if (change.type === 'added') {
              const updateData = change.doc.data();
              console.log('Real-time update received:', updateData);
              
              // Don't process updates from the current user
              if (updateData.senderId !== currentUser.uid) {
                console.log('Friend updated their mood, refreshing widget data');
                await refreshAllFriendWidgetData();
              }
            }
          });
        });
      } catch (error) {
        console.error('Error setting up widget update listener:', error);
      }
    };
    
    // Initialize the widget update listener
    setupWidgetUpdateListener();
    
    // Clean up
    return () => {
      clearInterval(refreshInterval);
      clearInterval(backgroundRefreshInterval);
      subscription.remove();
      if (unsubscribeWidgetUpdates) {
        unsubscribeWidgetUpdates();
      }
      // Clean up messaging listeners if they were set up
      messagingCleanup.then(unsubscribeFunc => {
        if (unsubscribeFunc) unsubscribeFunc();
      });
    };
  }, []);

  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}