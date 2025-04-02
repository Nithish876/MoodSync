import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { NativeModules } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase/config';

// Set up notifications to show when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
    
    // Add a dedicated channel for friend updates
    await Notifications.setNotificationChannelAsync('friend_updates', {
      name: 'Friend Mood Updates',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 100, 200, 300],
      lightColor: '#FF8800',
      description: 'Notifications when your friends update their moods'
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    return;
  }

  token = (await Notifications.getExpoPushTokenAsync()).data;
  
  return token;
}

export async function sendFriendMoodUpdateNotification(recipientId: string, type: 'color' | 'word') {
  try {
    // Don't send notification if recipient is the current user
    const currentUser = getAuth().currentUser;
    if (currentUser && recipientId === currentUser.uid) {
      console.log('Skipping self-notification');
      return;
    }
    
    // Get the recipient's user info for a personalized notification
    const recipientDoc = await getDoc(doc(db, 'users', recipientId));
    
    if (!recipientDoc.exists()) {
      console.log(`User ${recipientId} not found for sending notification`);
      return;
    }
    
    // Get current user's name if available
    const senderName = currentUser?.displayName || 'Your friend';
    
    // Create notification content based on the type
    const notificationTitle = 'Friend Mood Update';
    const notificationBody = type === 'color' 
      ? `${senderName} just updated their mood!` 
      : `${senderName} shared new thoughts!`;
    
    // Use multiple notification channels
    
    // Channel 1: Local notification via Expo Notifications
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notificationTitle,
          body: notificationBody,
          data: { 
            type: 'friend_mood_update',
            senderId: currentUser?.uid,
            recipientId,
            updateType: type 
          },
          sound: 'default',
          badge: 1,
        },
        trigger: null, // Send immediately
      });
      console.log(`Local notification scheduled for user ${recipientId}`);
    } catch (expoError) {
      console.error('Error scheduling local notification:', expoError);
    }
    
    // Channel 2: Try using native notification module if available
    try {
      if (Platform.OS === 'android' && NativeModules.NotificationModule) {
        await NativeModules.NotificationModule.sendNotification(
          recipientId,
          notificationTitle,
          notificationBody,
          JSON.stringify({
            type: 'friend_mood_update',
            senderId: currentUser?.uid,
            recipientId,
            updateType: type
          })
        );
        console.log(`Native notification sent to user ${recipientId}`);
      }
    } catch (nativeError) {
      console.warn('Native notification module unavailable:', nativeError);
    }
    
    // Channel 3: Record in Firestore for backup delivery
    await addDoc(collection(db, 'notifications'), {
      recipientId,
      senderId: currentUser?.uid,
      title: notificationTitle,
      body: notificationBody,
      type: 'friend_mood_update',
      updateType: type,
      read: false,
      timestamp: Date.now()
    });
    
    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    return false;
  }
}
