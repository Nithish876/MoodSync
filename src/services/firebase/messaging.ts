import { Platform } from 'react-native';
import { auth, db } from './config';
import { doc, setDoc, getDoc, collection, addDoc } from 'firebase/firestore';
import { refreshAllFriendWidgetData } from '../../utils/widgetHelpers';
import { 
  DocumentSnapshot, 
  DocumentChange, 
  QuerySnapshot, 
  QueryDocumentSnapshot 
} from "firebase/firestore";

// Import FirebaseMessagingTypes if needed
import type { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

// Try to get the messaging module if available
let firebaseMessaging: any = null;
try {
  // Dynamic import of the Firebase messaging module
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    // This will be required at runtime only if the import succeeds
    const messagingModule = require('@react-native-firebase/messaging');
    firebaseMessaging = messagingModule.default;
  }
} catch (error) {
  console.warn('Firebase messaging module not available:', error);
}

/**
 * Initialize Firebase Cloud Messaging
 */
export const initializeMessaging = async () => {
  if (!firebaseMessaging) {
    console.log('Firebase messaging not available on this platform or not installed');
    return false;
  }
  
  if (Platform.OS === 'ios') {
    const authStatus = await firebaseMessaging().requestPermission();
    const enabled = 
      authStatus === firebaseMessaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === firebaseMessaging.AuthorizationStatus.PROVISIONAL;
      
    if (!enabled) {
      console.log('Firebase messaging permissions not granted');
      return false;
    }
  }
  
  // Get FCM token
  try {
    const token = await firebaseMessaging().getToken();
    if (token) {
      await saveTokenToDatabase(token);
      return true;
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }
  
  return false;
};

/**
 * Save FCM token to Firestore
 */
const saveTokenToDatabase = async (token: string) => {
  try {
    const user = auth.currentUser;
    if (!user) return;
    
    // Store token in user's profile
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, { fcmToken: token }, { merge: true });
    
    console.log('FCM token saved to database');
  } catch (error) {
    console.error('Error saving FCM token:', error);
  }
};

/**
 * Set up FCM message handlers
 */
export const setupMessagingListeners = () => {
  if (!firebaseMessaging) {
    console.log('Firebase messaging not available, skipping message listeners');
    return () => {}; // Return empty cleanup function
  }
  
  // Handle messages when app is in foreground
  const unsubscribeForeground = firebaseMessaging().onMessage(async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
    console.log('Message received in foreground:', remoteMessage);
    
    // Check if it's a mood update notification
    if (remoteMessage.data?.type === 'mood_update') {
      // Refresh friend widget data
      await refreshAllFriendWidgetData();
    }
  });
  
  // Handle messages when app is in background
  firebaseMessaging().setBackgroundMessageHandler(async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
    console.log('Message received in background:', remoteMessage);
    
    // Check if it's a mood update notification
    if (remoteMessage.data?.type === 'mood_update') {
      // Refresh friend widget data
      await refreshAllFriendWidgetData();
    }
  });
  
  // Handle FCM token refresh
  const unsubscribeTokenRefresh = firebaseMessaging().onTokenRefresh(async (token: string) => {
    await saveTokenToDatabase(token);
  });
  
  // Set up listener for Firestore notifications as backup method
  let unsubscribeNotifications: (() => void) | null = null;
  
  const setupNotificationsListener = async () => {
    const user = auth.currentUser;
    if (!user) return null;
    
    try {
      // Get this device's FCM token
      let token;
      if (firebaseMessaging) {
        token = await firebaseMessaging().getToken();
      } else {
        // Without FCM, we can't set up device-specific notifications
        return null;
      }
      
      if (!token) return null;
      
      // Create a query to listen for notifications for this device
      const { query, where, onSnapshot, orderBy, limit } = require('firebase/firestore');
      const notificationsQuery = query(
        collection(db, 'notifications'),
        where('token', '==', token),
        where('sent', '==', false),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      
      // Set up the listener
      return onSnapshot(notificationsQuery, async (snapshot: any) => {
        snapshot.docChanges().forEach(async (change: any) => {
          if (change.type === 'added') {
            const notification = change.doc.data();
            console.log('Received Firestore notification:', notification);
            
            // Process the notification
            if (notification.data?.type === 'mood_update') {
              await refreshAllFriendWidgetData();
            }
            
            // Mark as sent
            try {
              const { updateDoc } = require('firebase/firestore');
              await updateDoc(change.doc.ref, { sent: true });
            } catch (updateError) {
              console.warn('Failed to mark notification as sent:', updateError);
            }
          }
        });
      });
    } catch (error) {
      console.error('Error setting up notifications listener:', error);
      return null;
    }
  };
  
  // Initialize the notifications listener
  setupNotificationsListener().then(unsub => {
    unsubscribeNotifications = unsub;
  });
  
  return () => {
    if (unsubscribeForeground) unsubscribeForeground();
    if (unsubscribeTokenRefresh) unsubscribeTokenRefresh();
    if (unsubscribeNotifications) unsubscribeNotifications();
  };
};

/**
 * Send mood update notification to friends
 */
export const notifyFriendsOfMoodUpdate = async (friendIds: string[]) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn('Cannot send notifications: No user logged in');
      return;
    }
    
    // Create notification payload
    const payload = {
      type: 'mood_update',
      senderId: user.uid,
      senderName: user.displayName || 'Your friend',
      timestamp: Date.now()
    };
    
    // Collect friend FCM tokens
    const tokens: string[] = [];
    for (const friendId of friendIds) {
      const friendDoc = await getDoc(doc(db, 'users', friendId));
      if (friendDoc.exists() && friendDoc.data().fcmToken) {
        tokens.push(friendDoc.data().fcmToken);
      }
    }
    
    if (tokens.length > 0) {
      console.log(`Found ${tokens.length} FCM tokens for sending notifications`);
      
      // Try using the CloudFunctions module if available
      try {
        const { NativeModules } = require('react-native');
        if (NativeModules.CloudFunctions && NativeModules.CloudFunctions.sendNotifications) {
          // Call the native module to send notifications
          const result = await NativeModules.CloudFunctions.sendNotifications(
            tokens,
            'Friend Mood Update',
            `${user.displayName || 'Your friend'} just updated their mood!`,
            JSON.stringify(payload)
          );
          console.log('Push notifications sent via CloudFunctions module', result);
          return;
        } else {
          console.log('CloudFunctions.sendNotifications method not available');
        }
      } catch (error) {
        console.log('Error using CloudFunctions module:', error);
      }

      // Fallback: Send via Firestore custom notification collection
      // This relies on the friends having a notification listener
      try {
        const notificationRef = collection(db, 'notifications');
        for (const token of tokens) {
          await addDoc(notificationRef, {
            token,
            title: 'Friend Mood Update',
            body: `${user.displayName || 'Your friend'} just updated their mood!`,
            data: payload,
            sent: false,
            createdAt: Date.now()
          });
        }
        console.log('Notifications saved to Firestore for delivery');
      } catch (firestoreError) {
        console.error('Error sending via Firestore:', firestoreError);
      }
      
      // Also add user-specific notifications as another fallback
      try {
        for (const friendId of friendIds) {
          // Add notification to user/{friendId}/notifications collection
          await addDoc(collection(db, `users/${friendId}/notifications`), {
            senderId: user.uid,
            title: 'Friend Mood Update',
            body: `${user.displayName || 'Your friend'} just updated their mood!`,
            data: payload,
            read: false,
            createdAt: Date.now()
          });
        }
        console.log('User-specific notifications created');
      } catch (userNotificationError) {
        console.error('Error creating user notifications:', userNotificationError);
      }
    } else {
      console.log('No FCM tokens found for notification');
    }
  } catch (error) {
    console.error('Error in notifyFriendsOfMoodUpdate:', error);
  }
};

export const setupWidgetUpdateListener = async () => {
  const user = auth.currentUser;
  if (!user) return;
  
  try {
    // Import Firestore functions
    const { collection, query, where, onSnapshot } = require('firebase/firestore');
    
    // SIMPLE QUERY THAT DOESN'T REQUIRE A COMPOSITE INDEX
    // Just query for updates that include this user's ID
    const widgetUpdatesQuery = query(
      collection(db, 'widgetUpdates'),
      where('friendIds', 'array-contains', user.uid)
    );
    
    // Set up the listener with proper type annotations
    const unsubscribeWidgetUpdates = onSnapshot(
      widgetUpdatesQuery, 
      (snapshot: QuerySnapshot) => {
        snapshot.docChanges().forEach(async (change: DocumentChange) => {
          if (change.type === 'added') {
            const updateData = change.doc.data();
            
            // Filter recent updates client-side (last 10 minutes)
            const tenMinutesAgo = Date.now() - (10 * 60 * 1000);
            if (updateData.timestamp > tenMinutesAgo && updateData.senderId !== user.uid) {
              console.log('Friend updated their mood, refreshing widget data');
              
              // Try to use the native module to refresh directly
              try {
                // Try to force refresh using the native module directly
                if (Platform.OS === 'android') {
                  const { NativeModules } = require('react-native');
                  if (NativeModules.WidgetModule && NativeModules.WidgetModule.refreshFriendWidgets) {
                    // Use the native method to trigger an immediate refresh
                    await NativeModules.WidgetModule.refreshFriendWidgets(updateData.senderId);
                    console.log('Directly refreshed widgets for friend:', updateData.senderId);
                  }
                }
              } catch (refreshError) {
                console.warn('Could not directly refresh widgets:', refreshError);
              }
              
              // Fallback to regular refresh
              await refreshAllFriendWidgetData();
            }
          }
        });
      },
      (error: Error) => {
        console.error('Widget update listener error:', error);
        
        // If error is about missing index, try an alternate approach
        if (error.message && error.message.includes('index')) {
          console.log('Firestore index error detected, using alternative approach');
          // Set up a basic timer instead
          const refreshInterval = setInterval(async () => {
            console.log('Refreshing widget data via timer fallback');
            await refreshAllFriendWidgetData();
          }, 60 * 1000); // Check every minute
          
          // Clean up interval when component unmounts
          return () => clearInterval(refreshInterval);
        }
      }
    );
    
    return unsubscribeWidgetUpdates;
  } catch (error) {
    console.error('Error setting up widget update listener:', error);
    return null;
  }
};

/**
 * Directly triggers a widget refresh for the given friend
 * This bypasses the data fetching process and just forces the widgets to update
 */
export const triggerFriendWidgetRefresh = async (friendId: string): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      const { NativeModules } = require('react-native');
      if (NativeModules.WidgetModule && NativeModules.WidgetModule.refreshFriendWidgets) {
        await NativeModules.WidgetModule.refreshFriendWidgets(friendId);
        console.log('Directly refreshed widgets for friend:', friendId);
        return true;
      }
    }
    
    // Fallback to regular refresh if direct method not available
    await refreshAllFriendWidgetData();
    return true;
  } catch (error) {
    console.error('Failed to trigger friend widget refresh:', error);
    return false;
  }
};