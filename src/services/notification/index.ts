import { NativeModules, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

const { NotificationService } = NativeModules;

// Initialize notification service
export const initializeNotifications = async () => {
  if (Platform.OS === 'android') {
    // Create notification channels using native module
    if (NotificationService?.createNotificationChannels) {
      try {
        await NotificationService.createNotificationChannels();
        console.log('Notification channels created successfully');
      } catch (error) {
        console.error('Failed to create notification channels:', error);
      }
    }
  }
  
  // Request permissions through Expo
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

// Send friend update notification
export const sendFriendMoodUpdateNotification = async (friendName: string, moodEmoji: string) => {
  if (Platform.OS === 'android' && NotificationService?.sendFriendUpdateNotification) {
    try {
      await NotificationService.sendFriendUpdateNotification(friendName, moodEmoji);
      return true;
    } catch (error) {
      console.error('Failed to send native notification:', error);
      // Fall back to Expo notifications
      return sendExpoNotification(friendName, moodEmoji);
    }
  } else {
    // Use Expo notifications if on iOS or native module unavailable
    return sendExpoNotification(friendName, moodEmoji);
  }
};

// Helper to send notification through Expo
const sendExpoNotification = async (friendName: string, moodEmoji: string) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Friend Mood Update',
        body: `${friendName} just updated their mood to ${moodEmoji}`,
        data: { type: 'friend_mood_update' },
      },
      trigger: null, // Send immediately
    });
    return true;
  } catch (error) {
    console.error('Failed to send Expo notification:', error);
    return false;
  }
}; 