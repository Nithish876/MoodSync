import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './config';
import { User } from '../../types/auth';

export const createUserProfile = async (userId: string, email: string): Promise<User> => {
  const userProfile: User = {
    id: userId,
    email,
    name: email.split('@')[0],
    friendCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    friends: [],
  };

  await setDoc(doc(db, 'users', userId), userProfile);
  return userProfile;
};

export const getUserProfile = async (userId: string): Promise<User | null> => {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as User) : null;
};

export const updateUserProfile = async (userId: string, data: Partial<User>): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, data);
}; 