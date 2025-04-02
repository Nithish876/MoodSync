import { NativeModules } from 'react-native';
import { doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../services/firebase/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedColorMix, SavedWordCloud, EmojiMood } from '../types/mood';
import { syncFriendWordCloudToWidgets } from './friendData';
// Import Notifications at the top level
import * as Notifications from 'expo-notifications';

const { WidgetModule, WidgetConfigModule } = NativeModules;


/**
 * Safely converts widget IDs to strings for native module calls
 */
export const prepareWidgetId = (widgetId: number | string): string => {
  return String(widgetId);
};

/**
 * Update widget configuration
 */
export const updateWidgetConfig = async (widgetId: number | string, config: any) => {
  try {
    const widgetIdStr = prepareWidgetId(widgetId);
    console.log(`Updating widget config for ID ${widgetIdStr}:`, config);
    
    // Call the native module with string widget ID
    const result = await WidgetConfigModule.updateWidgetConfig(widgetIdStr, config);

    // After saving the widget configuration
    if (config.friendId && config.isOwnMood === false) {
      // Sync both color and word cloud data
      syncFriendWordCloudToWidgets(config.friendId);
    }

    return result;
  } catch (error) {
    console.error('Error updating widget config:', error);
    throw error;
  }
};

/**
 * Get widget configuration
 */
export const getWidgetConfig = async (widgetId: number | string) => {
  try {
    const widgetIdStr = prepareWidgetId(widgetId);
    return await WidgetConfigModule.getWidgetInfo(widgetIdStr);
  } catch (error) {
    console.error('Error getting widget config:', error);
    throw error;
  }
};

/**
 * Update user's color mood on widgets
 * Using the same function name as in friendData.ts but for the user
 */
export const updateUserColorMood = async (userId: string, colorMix: SavedColorMix) => {
  try {
    console.log('Updating user color mood on widgets');
    return await WidgetModule.updateUserColorMood(
      userId,
      JSON.stringify(colorMix)
    );
  } catch (error) {
    console.error('Error updating user color mood:', error);
    throw error;
  }
};

/**
 * Update user's word cloud on widgets
 * Using the same function name as in friendData.ts but for the user
 */
export const updateUserWordCloud = async (userId: string, wordCloud: SavedWordCloud) => {
  try {
    console.log('Updating user word cloud on widgets');
    return await WidgetModule.updateUserWordCloud(
      userId, 
      JSON.stringify(wordCloud)
    );
  } catch (error) {
    console.error('Error updating user word cloud:', error);
    throw error;
  }
};

/**
 * Force update all widgets
 */
export const forceUpdateAllWidgets = async () => {
  try {
    console.log('Forcing update of all widgets');
    return await WidgetModule.forceUpdateAllWidgets();
  } catch (error) {
    console.error('Error forcing widget updates:', error);
    throw error;
  }
};

/**
 * Update all widgets with user mood data
 */
export const updateAllWidgetsWithUserMood = async (moodData: any) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn('Cannot update widgets: no user is logged in');
      return;
    }
    
    // Format the data for widgets
    const summaryData = moodData?.moodData || [];
    const widgetData = {
      emojis: summaryData.map((m: any) => m.emoji),
      names: summaryData.map((m: any) => m.name),
      percentages: summaryData.map((m: any) => m.percentage),
      narrative: moodData?.narrative || "No moods added yet"
    };
    
    // Call the appropriate method - trying both names to be safe
    // Only one of these should exist
    if (typeof WidgetModule.updateUserMoodPercentages === 'function') {
      await WidgetModule.updateUserMoodPercentages(
        JSON.stringify(widgetData)
      );
    } else if (typeof WidgetModule.updateColorMix === 'function') {
      await WidgetModule.updateColorMix(
        user.uid,
        JSON.stringify(widgetData)
      );
    } else {
      console.warn('No compatible widget update method found');
      return;
    }
    
    // Force refresh all widgets
    await WidgetModule.forceUpdateAllWidgets();
    console.log('All widgets updated successfully');
    
  } catch (error) {
    console.error('Failed to update widgets with mood data:', error);
  }
};

/**
 * Update all user mood data in a single call
 * This is the preferred method to use when you have both color and word data
 * @param userData Complete user data including both color mix and word cloud
 */
export const updateAllUserWidgetData = async (userData: {
  colorMix?: SavedColorMix,
  wordCloud?: SavedWordCloud
}) => {
  try {
    console.log('Updating all user widget data at once');
    let updatePromises = [];
    
    // Update color mix data if available
    if (userData.colorMix) {
      // Main color mix data (for large widgets)
      updatePromises.push(updateUserColorMixData(userData.colorMix));
      
      // Simplified mood percentages (for small widgets)
      updatePromises.push(updateUserMoodPercentages(userData.colorMix));
    }
    
    // Update word cloud data if available
    if (userData.wordCloud) {
      const user = auth.currentUser;
      if (user) {
        updatePromises.push(updateUserWordCloud(user.uid, userData.wordCloud));
      }
    }
    
    // Wait for all updates to complete
    await Promise.all(updatePromises);
    
    // Force all widgets to refresh
    await refreshAllWidgets();
    
    console.log('All user widget data updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating all user widget data:', error);
    return false;
  }
};

/**
 * Updates user's color mix with complete data (large widgets)
 * Use this when you have full color mix data and need detailed rendering
 */
export const updateUserColorMixData = async (colorMix: SavedColorMix) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn('Cannot update widgets: no user is logged in');
      return;
    }
    
    console.log('Updating user color mix data on widgets', colorMix);
    
    // Format data to match what the widget expects
    const formattedData = {
      userId: user.uid,
      emojis: colorMix.moods?.map((m: EmojiMood) => m.emoji) || [],
      names: colorMix.moods?.map((m: EmojiMood) => m.name) || [],
      percentages: colorMix.moods?.map((m: EmojiMood) => m.percentage) || [],
      narrative: colorMix.summary || "No moods added yet"
    };
    
    // Call the native method that was shown in debug screen
    return await WidgetModule.updateUserColorMixData(JSON.stringify(formattedData));
  } catch (error) {
    console.error('Error updating user color mix data:', error);
    throw error;
  }
};

/**
 * Updates user's color mix with simplified percentage data (small widgets)
 * Use this for compact widgets that only show percentages
 */
export const updateUserMoodPercentages = async (colorMix: SavedColorMix) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn('Cannot update widgets: no user is logged in');
      return;
    }
    
    console.log('Updating user mood percentages on widgets');
    
    // Format the data correctly for the widget
    const formattedData = {
      userId: user.uid,
      emojis: colorMix.moods?.map((m: EmojiMood) => m.emoji) || [],
      names: colorMix.moods?.map((m: EmojiMood) => m.name) || [],
      percentages: colorMix.moods?.map((m: EmojiMood) => m.percentage) || [],
      narrative: colorMix.summary || "No moods added yet"
    };
    
    // Call the native method that was shown in debug screen
    return await WidgetModule.updateUserMoodPercentages(JSON.stringify(formattedData));
  } catch (error) {
    console.error('Error updating user mood percentages:', error);
    throw error;
  }
};

/**
 * Update friend's color mood on widgets - matches native method exactly
 */
export const updateFriendColorMood = async (friendId: string, friendName: string, colorMixData: SavedColorMix) => {
  try {
    console.log(`Updating color mood for friend ${friendName} (${friendId})`);
    
    // Format data specifically for friend widget
    const formattedData = {
      friendId,
      friendName,
      emojis: colorMixData.moods?.map((m: EmojiMood) => m.emoji) || [],
      names: colorMixData.moods?.map((m: EmojiMood) => m.name) || [],
      percentages: colorMixData.moods?.map((m: EmojiMood) => m.percentage) || [],
      narrative: colorMixData.summary || `${friendName} hasn't updated moods yet`
    };
    
    // Call the correct native method that exists
    return await WidgetModule.updateFriendColorMood(
      friendId,
      friendName,
      JSON.stringify(formattedData)
    );
  } catch (error) {
    console.error(`Error updating friend color mood for ${friendName}:`, error);
    throw error;
  }
};

/**
 * Update all widgets to refresh with latest data
 */
export const refreshAllWidgets = async () => {
  try {
    console.log('Forcing update of all widgets');
    return await WidgetModule.forceUpdateAllWidgets();
  } catch (error) {
    console.error('Error forcing widget updates:', error);
    throw error;
  }
};

/**
 * Sync/update both types of user widgets at once (convenience function)
 */
export const syncAllUserWidgets = async (userData: any) => {
  const user = auth.currentUser;
  if (!user) return;
  
  try {
    console.log('Syncing all user widgets with latest data');
    
    // First update color mix data
    await updateUserColorMixData(userData);
    
    // Then update mood percentages
    await updateUserMoodPercentages(userData);
    
    // Force refresh
    await refreshAllWidgets();
    
    console.log('All user widgets synced successfully');
  } catch (error) {
    console.error('Failed to sync all user widgets:', error);
  }
};

/**
 * Legacy method for syncing color mix data
 * @deprecated Use updateUserColorMixData instead
 */
export const syncColorMixData = async (userId: string, colorHex: string) => {
  // Existing implementation
};

/**
 * Update friend's word cloud on widgets
 */
export const updateFriendWordCloud = async (friendId: string, friendName: string, wordCloud: SavedWordCloud) => {
  try {
    if (!wordCloud?.words?.length) {
      console.warn(`No word cloud data to update for friend ${friendName}`);
      return false;
    }
    
    console.log(`Updating word cloud for friend ${friendName} (${friendId})`);
    
    // Format the data for widget display
    const wordCloudData = {
      title: wordCloud.title || '',
      words: wordCloud.words,
      text: wordCloud.words.map(word => word.text).join(", ")
    };
    
    // Call the native module
    return await WidgetModule.syncFriendWordCloudData(
      friendId,
      friendName,
      JSON.stringify(wordCloudData)
    );
  } catch (error) {
    console.error(`Error updating friend word cloud for ${friendName}:`, error);
    return false;
  }
};

/**
 * Refreshes all friend widget data by polling Firestore
 * Call this when the app starts and periodically
 */
export const refreshAllFriendWidgetData = async (): Promise<boolean> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn('Cannot refresh friend data: no user logged in');
      return false;
    }
    
    console.log('Refreshing all friend widget data');
    
    // Get the user's friend list
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      console.warn('User document not found');
      return false;
    }
    
    const userData = userDoc.data();
    const friendIds = userData?.friends || [];
    
    if (friendIds.length === 0) {
      console.log('No friends to refresh');
      return true;
    }
    
    console.log(`Found ${friendIds.length} friends to refresh`);
    
    // Track stats for logging
    const stats = {
      total: friendIds.length,
      colorUpdated: 0,
      wordUpdated: 0,
      skipped: 0,
      errors: 0
    };
    
    // For each friend, fetch their latest data and update widgets
    const updatePromises = friendIds.map(async (friendId: string) => {
      try {
        // Get friend info (name)
        const friendDoc = await getDoc(doc(db, 'users', friendId));
        if (!friendDoc.exists()) {
          stats.skipped++;
          return;
        }
        
        const friendData = friendDoc.data();
        const friendName = friendData.displayName || friendData.username || 'Friend';
        
        // Get latest color mood data
        const colorMixDoc = await getDoc(doc(db, 'colorMixes', friendId));
        if (colorMixDoc.exists()) {
          const colorMix = colorMixDoc.data() as SavedColorMix;
          
          // Only update if the data is newer
          if (colorMix.timestamp) {
            // Store the last updated timestamp locally
            const lastUpdated = await AsyncStorage.getItem(`friend_${friendId}_color_updated`) || '0';
            const lastTimestamp = parseInt(lastUpdated);
            
            if (colorMix.timestamp > lastTimestamp) {
              // Update color mood data - it's newer
              console.log(`Updating color mood for friend ${friendName} (newer data: ${new Date(colorMix.timestamp).toLocaleString()})`);
              await updateFriendColorMood(friendId, friendName, colorMix);
              // Save the new timestamp
              await AsyncStorage.setItem(`friend_${friendId}_color_updated`, colorMix.timestamp.toString());
              stats.colorUpdated++;
            } else {
              console.log(`Skipping color update for ${friendName}, no new data`);
            }
          } else {
            // No timestamp, update anyway
            await updateFriendColorMood(friendId, friendName, colorMix);
            stats.colorUpdated++;
          }
        }
        
        // Get latest word cloud data
        const wordCloudDoc = await getDoc(doc(db, 'wordClouds', friendId));
        if (wordCloudDoc.exists()) {
          const wordCloud = wordCloudDoc.data() as SavedWordCloud;
          
          // Only update if the data is newer
          if (wordCloud.timestamp) {
            // Store the last updated timestamp locally
            const lastUpdated = await AsyncStorage.getItem(`friend_${friendId}_word_updated`) || '0';
            const lastTimestamp = parseInt(lastUpdated);
            
            if (wordCloud.timestamp > lastTimestamp) {
              // Update word cloud data - it's newer
              console.log(`Updating word cloud for friend ${friendName} (newer data: ${new Date(wordCloud.timestamp).toLocaleString()})`);
              await updateFriendWordCloud(friendId, friendName, wordCloud);
              // Save the new timestamp
              await AsyncStorage.setItem(`friend_${friendId}_word_updated`, wordCloud.timestamp.toString());
              stats.wordUpdated++;
            } else {
              console.log(`Skipping word cloud update for ${friendName}, no new data`);
            }
          } else {
            // No timestamp, update anyway
            await updateFriendWordCloud(friendId, friendName, wordCloud);
            stats.wordUpdated++;
          }
        }
      } catch (error) {
        console.error(`Error refreshing data for friend ${friendId}:`, error);
        stats.errors++;
      }
    });
    
    // Wait for all updates to complete
    await Promise.all(updatePromises);
    
    // Force update widgets if any updates happened
    if (stats.colorUpdated > 0 || stats.wordUpdated > 0) {
      console.log('Updates detected, forcing widget refresh');
      await forceUpdateAllWidgets();
    }
    
    console.log(`Friend widget refresh complete: ${stats.colorUpdated} color updates, ${stats.wordUpdated} word updates, ${stats.skipped} skipped, ${stats.errors} errors`);
    return true;
  } catch (error) {
    console.error('Error refreshing friend widget data:', error);
    return false;
  }
};

/**
 * Direct sync of color and narrative to widgets - works around any processing issues
 */
export const syncSimplifiedWidgetData = async (userId: string, color: string, narrative: string) => {
  try {
    if (!WidgetModule) {
      console.warn('Widget module not available');
      return false;
    }
    
    // Create simplified data that bypasses complex parsing
    const simplifiedData = {
      userId: userId,
      mixedColor: color,
      narrative: narrative,
      timestamp: Date.now(),
      // Include these fields to ensure they're available even without parsing
      moods: [{
        color: color,
        name: 'Mood',
        emoji: '😊',
        percentage: 100
      }]
    };
    
    console.log('Syncing simplified widget data:', JSON.stringify(simplifiedData));
    
    // Send directly to widget modules - try both methods
    if (WidgetModule.syncColorMixData) {
      await WidgetModule.syncColorMixData(
        userId,
        color,
        JSON.stringify(simplifiedData)
      );
    }
    
    if (WidgetModule.updateUserColorMixData) {
      await WidgetModule.updateUserColorMixData(
        JSON.stringify(simplifiedData)
      );
    }
    
    await WidgetModule.forceUpdateAllWidgets();
    return true;
  } catch (error) {
    console.error('Error syncing simplified widget data:', error);
    return false;
  }
};

/**
 * Calculate a blended color from multiple mood colors
 */
const calculateBlendedColor = (moods: EmojiMood[]): string => {
  if (!moods || moods.length === 0) return "#3498db";
  if (moods.length === 1) return moods[0].color;
  
  // Calculate weighted average of colors
  let r = 0, g = 0, b = 0;
  const totalMoods = moods.length;
  
  moods.forEach(mood => {
    const hex = mood.color.replace('#', '');
    const rgb = parseInt(hex, 16);
    const red = (rgb >> 16) & 0xFF;
    const green = (rgb >> 8) & 0xFF;
    const blue = rgb & 0xFF;
    
    r += red / totalMoods;
    g += green / totalMoods;
    b += blue / totalMoods;
  });
  
  // Convert back to hex
  return `#${((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1)}`;
};

/**
 * Updates widget data with guaranteed compatibility with native side
 */
export const updateWidgetWithGuaranteedFormat = async (userId: string, moodData: {
  narrative?: string;
  moods: EmojiMood[];
}): Promise<boolean> => {
  try {
    if (!WidgetModule) {
      console.warn('Widget module not available');
      return false;
    }
    
    // Get the essential data fields
    const narrative = moodData?.narrative || "No mood data";
    const moods = moodData?.moods || [];
    
    // Calculate the mixed color using our helper
    const mixedColor = calculateBlendedColor(moods);
    
    // Format data in THREE different ways to ensure compatibility
    const completeData = {
      // Format 1: Direct fields at root level
      mixedColor: mixedColor,
      narrative: narrative,
      userId: userId,
      timestamp: Date.now(),
      
      // Format 2: Nested under "summaryObject" 
      summaryObject: {
        narrative: narrative,
        mixedColor: mixedColor,
        timestamp: Date.now()
      },
      
      // Format 3: Arrays of component data
      moods: moods,
      emojis: moods.map(m => m.emoji),
      names: moods.map(m => m.name),
      percentages: moods.map(m => m.percentage || 100 / moods.length),
    };
    
    console.log('Sending guaranteed-format widget data:', JSON.stringify(completeData));
    
    // Try both native methods
    if (WidgetModule.syncColorMixData) {
      await WidgetModule.syncColorMixData(
        userId,
        mixedColor, // Send color separately
        JSON.stringify(completeData)
      );
    }
    
    if (WidgetModule.updateUserColorMixData) {
      await WidgetModule.updateUserColorMixData(
        JSON.stringify(completeData)
      );
    }
    
    // Also update mood percentages for small widgets
    if (WidgetModule.updateUserMoodPercentages) {
      await WidgetModule.updateUserMoodPercentages(
        JSON.stringify(completeData)
      );
    }
    
    await WidgetModule.forceUpdateAllWidgets();
    return true;
  } catch (error) {
    console.error('Error with guaranteed widget sync:', error);
    return false;
  }
};

/**
 * Direct update for widget compatibility - specifically formatted for LargeColorWidget.kt
 */
export const updateWidgetsWithExactFormat = async (data: {
  userId: string,
  narrative: string,
  mixedColor: string,
  moods: EmojiMood[]
}): Promise<boolean> => {
  try {
    if (!WidgetModule) {
      console.warn('Widget module not available');
      return false;
    }
    
    const { userId, narrative, mixedColor, moods } = data;
    
    // Create data formats that EXACTLY match what LargeColorWidget.kt expects
    
    // 1. Direct values for faster access
    try {
      // First directly set narrative and color in SharedPreferences
      if (WidgetModule.setWidgetDirectValues) {
        await WidgetModule.setWidgetDirectValues(
          userId,
          narrative,
          mixedColor
        );
        console.log('Direct values set for widgets');
      }
    } catch (e) {
      console.log('Direct value setting not available:', e);
    }
    
    // 2. Synchronized format
    const formattedSummary = {
      narrative: narrative,
      mixedColor: mixedColor,
      timestamp: Date.now(),
      userId: userId,
      moods: moods.map(mood => ({
        emoji: mood.emoji,
        name: mood.name,
        color: mood.color,
        percentage: mood.percentage || 100 / moods.length,
        id: mood.id || Date.now().toString(),
        timestamp: mood.timestamp || Date.now(),
        volume: mood.volume || 1
      }))
    };
    
    console.log('Updating widgets with exact format:', JSON.stringify(formattedSummary));
    
    // Use both methods to ensure compatibility
    if (WidgetModule.syncColorMixData) {
      await WidgetModule.syncColorMixData(
        userId,
        mixedColor,
        JSON.stringify({
          // IMPORTANT: Make sure this exactly matches what native code expects
          summaryObject: { narrative },
          narrative: narrative,
          moods: formattedSummary.moods
        })
      );
    }
    
    // Also try the direct update method
    if (WidgetModule.updateUserColorMixData) {
      await WidgetModule.updateUserColorMixData(
        JSON.stringify(formattedSummary)
      );
    }
    
    // Force update all widgets
    await WidgetModule.forceUpdateAllWidgets();
    
    // For debugging native-side data extraction
    try {
      if (WidgetModule.logWidgetData) {
        await WidgetModule.logWidgetData(userId);
      }
    } catch (e) {}
    
    return true;
  } catch (error) {
    console.error('Widget update with exact format failed:', error);
    return false;
  }
};

// Safe way to get the widget module
export const getWidgetModule = () => {
  try {
    const { NativeModules, Platform } = require('react-native');
    if (Platform.OS === 'android' && NativeModules.WidgetModule) {
      return NativeModules.WidgetModule;
    }
    return null;
  } catch (error) {
    console.warn('Widget module not available:', error);
    return null;
  }
};

// Update the simpleWidgetSync function to use the safe widget module getter
export const simpleWidgetSync = async (userId: string, narrative: string, color: string): Promise<boolean> => {
  try {
    const WidgetModule = getWidgetModule();
    if (!WidgetModule) {
      console.warn('Widget module not available');
      return false;
    }
    
    // Try the direct method first if available (added to fix widget issues)
    if (WidgetModule.setWidgetDirectValues) {
      try {
        await WidgetModule.setWidgetDirectValues(userId, narrative, color);
        console.log('Widget values set directly with new method');
        return true;
      } catch (directError) {
        console.warn('Direct widget value setting failed, falling back to legacy method', directError);
        // Continue with legacy method
      }
    }
    
    // This is the minimal data that LargeColorWidget is looking for
    const minimalData = {
      // Store top-level fields directly
      narrative: narrative,
      mixedColor: color,
      userId: userId,
      summary: narrative,  // Alternative field sometimes checked
      
      // Also provide all fields that syncColorMixData might extract
      "summaryObject": {
        "narrative": narrative
      },
      
      // Provide a placeholder mood since this is required by the widget
      "moods": [
        {
          "emoji": "😊", 
          "color": color,
          "name": "Mood", 
          "percentage": 100
        }
      ]
    };
    
    console.log('Sending minimal widget data:', JSON.stringify(minimalData));
    
    // Call syncColorMixData with the minimal data
    if (WidgetModule.syncColorMixData) {
      await WidgetModule.syncColorMixData(
        userId,
        color,
        JSON.stringify(minimalData)
      );
    }
    
    // Force update the widgets
    await WidgetModule.forceUpdateAllWidgets();
    
    return true;
  } catch (error) {
    console.error('Simple widget sync failed:', error);
    return false;
  }
};

/**
 * Calls the server function to notify friends of widget updates
 * This triggers immediate widget refresh on friends' devices
 */
export const callWidgetUpdateServerFunction = async (
  userId: string,
  updateType: 'color_mix' | 'word_cloud',
  friendIds: string[]
): Promise<boolean> => {
  try {
    if (!friendIds || friendIds.length === 0) {
      console.log('No friends to notify');
      return true;
    }
    
    console.log(`Notifying ${friendIds.length} friends of mood update`);
    
    // First approach: Use Firestore to trigger the update with better error handling
    try {
      await addDoc(collection(db, 'widgetUpdates'), {
        senderId: userId,
        updateType,
        friendIds,
        timestamp: Date.now()
      });
      console.log(`Widget update notification sent to ${friendIds.length} friends via Firestore`);
    } catch (firestoreError) {
      console.error('Failed to send via Firestore:', firestoreError);
      // Continue to try other methods
    }
    
    // Use the Firebase Messaging module to send push notifications if available
    try {
      // Import triggerFriendWidgetRefresh from messaging dynamically to avoid circular imports
      const { triggerFriendWidgetRefresh, notifyFriendsOfMoodUpdate } = require('../services/firebase/messaging');
      
      // Try to send push notifications
      await notifyFriendsOfMoodUpdate(friendIds);
      
      // Also try to directly trigger widget updates for each friend
      await Promise.all(friendIds.map(async (friendId) => {
        try {
          await triggerFriendWidgetRefresh(friendId);
        } catch (refreshError) {
          console.warn(`Could not refresh widgets for friend ${friendId}:`, refreshError);
        }
      }));
      
      console.log('Push notifications and direct widget refreshes sent');
    } catch (messagingError) {
      console.warn('Could not use messaging module:', messagingError);
    }
    
    // Also try creating individual notifications for each friend
    try {
      await Promise.all(friendIds.map(async (friendId) => {
        try {
          // Add to notifications collection for this specific friend
          await addDoc(collection(db, 'notifications'), {
            recipientId: friendId,
            senderId: userId,
            type: 'mood_update',
            updateType: updateType,
            read: false,
            timestamp: Date.now()
          });
        } catch (notificationError) {
          console.warn(`Failed to create notification for friend ${friendId}:`, notificationError);
        }
      }));
      console.log('Individual friend notifications created in Firestore');
    } catch (notificationsError) {
      console.error('Failed to create individual notifications:', notificationsError);
    }
    
    // Try to trigger push notifications - import at the top level to avoid circular dependencies
    try {
      // Use the already imported Notifications module
      // Try to send a notification directly (will only work on the device itself)
      await Promise.allSettled(friendIds.map(async (friendId) => {
        try {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Friend Mood Update',
              body: 'Your friend updated their mood!',
              data: {
                type: 'mood_update',
                senderId: userId,
                friendId
              },
            },
            trigger: null, // Send immediately
          });
        } catch (expoPushError) {
          console.warn(`Could not send Expo notification to friend ${friendId}:`, expoPushError);
        }
      }));
      
      console.log('Local notifications scheduled (these only work for current device)');
    } catch (notifyError) {
      console.warn('Could not send push notifications:', notifyError);
    }
    
    return true;
  } catch (error) {
    console.error('Error calling widget update server function:', error);
    return false;
  }
}; 