import { NativeModules } from 'react-native';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../services/firebase/config';
import { SavedColorMix, SavedWordCloud, EmojiMood } from '../types/mood';

export const getFriendMoodData = async (friendId: string): Promise<{
  colorMix: SavedColorMix | null;
  wordCloud: SavedWordCloud | null;
}> => {
  try {
    if (!friendId) {
      console.warn('No friend ID provided to getFriendMoodData');
      return { colorMix: null, wordCloud: null };
    }
    
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error('User must be logged in to access friend data');
      return { colorMix: null, wordCloud: null };
    }
    
    console.log(`Fetching mood data for friend with ID: ${friendId}`);
    
    // First check if this is actually a friend
    const friendRef = doc(db, 'users', currentUser.uid, 'friends', friendId);
    const friendDoc = await getDoc(friendRef);
    if (!friendDoc.exists()) {
      console.warn(`Friend relationship not found for ID: ${friendId}`);
      // Continue anyway - the Firestore rules will enforce permissions
    }
    
    // Get friend's color mix data
    const colorMixDoc = await getDoc(doc(db, 'colorMixes', friendId));
    const colorMix = colorMixDoc.exists() ? colorMixDoc.data() as SavedColorMix : null;
    
    if (colorMix) {
      console.log(`Found color mix data for friend ${friendId}`);
    } else {
      console.warn(`No color mix data found for friend ${friendId}`);
    }
    
    // Get friend's word cloud data
    const wordCloudDoc = await getDoc(doc(db, 'wordClouds', friendId));
    const wordCloud = wordCloudDoc.exists() ? wordCloudDoc.data() as SavedWordCloud : null;
    
    if (wordCloud) {
      console.log(`Found word cloud data for friend ${friendId}`);
    } else {
      console.warn(`No word cloud data found for friend ${friendId}`);
    }
    
    return { colorMix, wordCloud };
  } catch (error: any) {
    // Enhanced error logging with specific Firebase error codes
    console.error(`Error getting friend mood data: ${error.message}`, error);
    
    // Check for specific Firebase errors that might indicate permission issues
    if (error.code === 'permission-denied') {
      console.error('Firebase permission denied. Check security rules.');
      alert('You do not have permission to view this friend\'s data. Make sure you are friends in the app.');
    } else if (error.code === 'unavailable') {
      console.error('Firebase service is unavailable. Check network connectivity.');
    }
    
    return { colorMix: null, wordCloud: null };
  }
};

interface MoodWidgetData {
  userId: string;
  friendName: string;
  mainColor: string;
  moodSummary: string;
  timestamp: number;
}

interface WordCloudWidgetData {
  userId: string;
  friendName: string;
  title: string;
  mainWords: string;
  timestamp: number;
}

// Function to prepare friend data for widgets
export const prepareFriendWidgetData = async (friendId: string): Promise<{
  success: boolean;
  colorMix: SavedColorMix | null;
  wordCloud: SavedWordCloud | null;
  friendName?: string;
}> => {
  try {
    if (!friendId) {
      console.warn('No friend ID provided to prepareFriendWidgetData');
      return { success: false, colorMix: null, wordCloud: null };
    }
    
    const user = auth.currentUser;
    if (!user) {
      console.error('User must be logged in to access friend data');
      return { success: false, colorMix: null, wordCloud: null };
    }
    
    // Get friend info
    const friendDoc = await getDoc(doc(db, 'users', friendId));
    if (!friendDoc.exists()) {
      console.warn(`Friend user profile not found: ${friendId}`);
      return { success: false, colorMix: null, wordCloud: null };
    }
    
    const friendData = friendDoc.data();
    const friendName = friendData.displayName || friendData.username || 'Friend';

    // Check friendship status
    const friendRef = doc(db, 'users', user.uid, 'friends', friendId);
    const friendRelationDoc = await getDoc(friendRef);
    
    if (!friendRelationDoc.exists()) {
      // Not in friends list, try to add if we have permission
      await updateDoc(doc(db, 'users', user.uid), {
        friends: arrayUnion(friendId)
      });
      
      // Also add us to their friends list for bidirectional link
      const friendUserRef = doc(db, 'users', friendId);
      const theirUserDoc = await getDoc(friendUserRef);
      
      if (theirUserDoc.exists()) {
        const theirData = theirUserDoc.data();
        const theirFriends = theirData.friends || [];
        
        if (!theirFriends.includes(user.uid)) {
          console.log(`Adding ${user.uid} to ${friendId}'s friends list`);
          // Add us to their friend list if needed
          await updateDoc(friendUserRef, {
            friends: arrayUnion(user.uid)
          });
        }
      }
    }
    
    // Fetch the friend's mood data
    const result = await getFriendMoodData(friendId);

    // Sync BOTH word cloud AND color mix data to widgets
    if (result.colorMix) {
      console.log('Syncing friend color mix data to widgets');
      
      const colorMix = result.colorMix;
      
      // Calculate main color from the moods
      let mixedColor = '#3498db'; // Default blue
      if (colorMix.moods && colorMix.moods.length > 0) {
        // If single mood, use its color directly
        if (colorMix.moods.length === 1) {
          mixedColor = colorMix.moods[0].color;
        } else {
          // Calculate weighted average of colors
          mixedColor = calculateMainColor(colorMix.moods);
        }
      }
      
      // Generate narrative if not available
      const narrative = colorMix.summary || generateMoodSummary(colorMix.moods);
      
      // Format the data for direct use by widgets
      const colorMixData = {
        mixedColor: mixedColor,
        narrative: narrative,
        moods: colorMix.moods || [],
        emojis: colorMix.moods?.map(m => m.emoji) || [],
        names: colorMix.moods?.map(m => m.name) || [],
        percentages: colorMix.moods?.map(m => m.percentage) || []
      };
      
      // Use the native module to sync the data with extra safety checks
      if (NativeModules.WidgetModule) {
        try {
          // Try to use the most appropriate method
          if (NativeModules.WidgetModule.updateFriendColorMood) {
            await NativeModules.WidgetModule.updateFriendColorMood(
              friendId,
              friendName,
              JSON.stringify(colorMixData)
            );
          } else if (NativeModules.WidgetModule.syncFriendMoodData) {
            await NativeModules.WidgetModule.syncFriendMoodData(
              friendId,
              friendName,
              mixedColor
            );
          }
          console.log(`Successfully synced color mix for friend ${friendName}`);
        } catch (e) {
          console.error('Error syncing friend color mix:', e);
        }
      }
    }
    
    // NEW CODE: Sync word cloud data to widgets if available
    if (result.wordCloud) {
      console.log('Syncing friend word cloud data to widgets');
      
      // Format the word cloud data for the widget
      const wordCloudData = {
        title: result.wordCloud.title || '',
        words: result.wordCloud.words,
        text: result.wordCloud.words.map(word => word.text).join(", ")
      };
      
      // Use the native module to sync the data
      if (NativeModules.WidgetModule) {
        try {
          await NativeModules.WidgetModule.syncFriendWordCloudData(
            friendId, 
            friendName, 
            JSON.stringify(wordCloudData)
          );
          console.log(`Successfully synced word cloud for friend ${friendName}`);
        } catch (e) {
          console.error('Error syncing friend word cloud:', e);
        }
      }
    }
    
    return { 
      success: true, 
      colorMix: result.colorMix, 
      wordCloud: result.wordCloud,
      friendName 
    };
    
  } catch (error) {
    console.error(`Error preparing widget data for friend ${friendId}:`, error);
    return { success: false, colorMix: null, wordCloud: null };
  }
};

// Helper functions
const calculateMainColor = (moods: EmojiMood[]): string => {
  if (!moods || moods.length === 0) return '#CCCCCC';
  
  if (moods.length === 1) {
    return moods[0].color;
  }
  
  // Calculate weighted average of colors
  const totalCount = moods.length;
  let r = 0, g = 0, b = 0;
  
  moods.forEach(mood => {
    const hex = mood.color.replace('#', '');
    const rgb = parseInt(hex, 16);
    const red = (rgb >> 16) & 0xFF;
    const green = (rgb >> 8) & 0xFF;
    const blue = rgb & 0xFF;
    
    r += red / totalCount;
    g += green / totalCount;
    b += blue / totalCount;
  });
  
  // Round to integers and convert back to hex
  return `#${((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1)}`;
};

const generateMoodSummary = (moods: EmojiMood[]): string => {
  if (!moods || moods.length === 0) return 'No mood data';
  
  if (moods.length === 1) {
    return `Feeling ${moods[0].name}`;
  }
  
  // Get top 2 moods
  const topMoods = moods.slice(0, 2);
  return `Feeling ${topMoods[0].name} with a hint of ${topMoods[1].name}`;
};

/**
 * Fetch and sync friend's word cloud data to their widgets
 * @param friendId The Firebase user ID of the friend
 */
export const syncFriendWordCloudToWidgets = async (friendId: string) => {
  try {
    if (!friendId) {
      console.log('No friend ID provided to syncFriendWordCloudToWidgets');
      return false;
    }

    // Get friend's user info for their name
    const friendDoc = await getDoc(doc(db, 'users', friendId));
    if (!friendDoc.exists()) {
      console.warn(`Friend user profile not found: ${friendId}`);
      return false;
    }
    
    const friendData = friendDoc.data();
    const friendName = friendData.displayName || friendData.username || 'Friend';

    // Get friend's word cloud data directly from Firestore
    const wordCloudDoc = await getDoc(doc(db, 'wordClouds', friendId));
    
    if (!wordCloudDoc.exists()) {
      console.log(`No word cloud data found for friend ${friendId}`);
      return false;
    }
    
    const wordCloud = wordCloudDoc.data() as SavedWordCloud;
    
    if (wordCloud?.words?.length) {
      console.log(`Found word cloud data for friend ${friendName}, syncing to widget`);
      
      // Format the word cloud data for the widget
      const wordCloudData = {
        title: wordCloud.title || '',
        words: wordCloud.words,
        text: wordCloud.words.map(word => word.text).join(", ")
      };
      
      // Use the existing syncFriendWordCloud function
      if (NativeModules.WidgetModule) {
        await NativeModules.WidgetModule.syncFriendWordCloudData(
          friendId, 
          friendName, 
          JSON.stringify(wordCloudData)
        );
        
        console.log(`Successfully synced word cloud data for friend ${friendName} to widget`);
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error syncing friend word cloud data with widgets:', error);
    return false;
  }
}; 