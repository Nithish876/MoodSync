import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase/config';

export interface FriendData {
  id: string;
  name: string;
  email: string;
}

/**
 * Gets the current user's friends list from Firestore
 * @param userId The current user's ID
 * @returns Array of friend data objects with id, name, and email
 */
export async function getFriendsList(userId?: string): Promise<FriendData[]> {
  if (!userId) return [];
  
  try {
    // Get user document from Firestore
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);
    
    if (!userDocSnap.exists()) {
      console.warn('User document not found');
      return [];
    }
    
    // Get friends array from user document
    const userData = userDocSnap.data();
    const friendIds = userData.friends || [];
    
    if (friendIds.length === 0) {
      return [];
    }
    
    // Fetch details for each friend
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
    
    return friendData;
  } catch (error) {
    console.error('Error fetching friends list:', error);
    return [];
  }
} 
