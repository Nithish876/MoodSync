import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit as firestoreLimit
} from 'firebase/firestore';
import type { SavedWordCloud, SavedColorMix } from '../types/mood';

const firestore = getFirestore();

type CollectionName = 'wordClouds' | 'colorMixes' | 'friends';

export interface Friend {
  id: string;
  name: string;
}

export interface FriendsData {
  connections: Friend[];
  updatedAt: number;
}

export const saveToFirestore = async (
  collectionName: CollectionName,
  userId: string,
  data: SavedWordCloud | SavedColorMix
) => {
  try {
    // Create a document reference with userId
    const docRef = doc(firestore, collectionName, userId);
    
    // Save data with metadata
    await setDoc(docRef, {
      ...data,
      userId,
      updatedAt: Date.now(),
      // Add friendCode for friend access
      friendCode: data.friendCode || null,
    }, { merge: true }); // Use merge to preserve existing data
  } catch (error) {
    console.error(`Error saving to ${collectionName}:`, error);
    throw error; // Propagate error for handling
  }
};

export const loadFromFirestore = async <T extends SavedWordCloud | SavedColorMix>(
  collectionName: CollectionName,
  userId: string
): Promise<T | null> => {
  try {
    const docRef = doc(firestore, collectionName, userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as T;
    }
    return null;
  } catch (error) {
    console.error(`Error loading from ${collectionName}:`, error);
    return null;
  }
};

export const getHistory = async <T extends SavedWordCloud | SavedColorMix>(
  collectionName: CollectionName,
  userId: string,
  limitCount = 10
) => {
  try {
    const q = query(
      collection(firestore, collectionName),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      firestoreLimit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as T);
  } catch (error) {
    console.error(`Error getting ${collectionName} history:`, error);
    return [];
  }
};

// New function to load friend's mood data
export const loadFriendMoodData = async (
  friendId: string
): Promise<{ wordCloud?: SavedWordCloud; colorMix?: SavedColorMix } | null> => {
  try {
    const [wordCloudDoc, colorMixDoc] = await Promise.all([
      getDoc(doc(firestore, 'wordClouds', friendId)),
      getDoc(doc(firestore, 'colorMixes', friendId))
    ]);

    return {
      wordCloud: wordCloudDoc.exists() ? wordCloudDoc.data() as SavedWordCloud : undefined,
      colorMix: colorMixDoc.exists() ? colorMixDoc.data() as SavedColorMix : undefined
    };
  } catch (error) {
    console.error('Error loading friend mood data:', error);
    return null;
  }
};

export const loadFriendsData = async (userId: string): Promise<FriendsData | null> => {
  try {
    const docRef = doc(firestore, 'friends', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as FriendsData;
    }
    return null;
  } catch (error) {
    console.error('Error loading friends data:', error);
    return null;
  }
}; 