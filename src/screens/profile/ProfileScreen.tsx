import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc, updateDoc, arrayUnion, query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from '@react-navigation/native';
import { prepareFriendWidgetData } from '../../utils/friendData';

interface UserProfile {
  email: string;
  name: string;
  friendCode: string;
  friends: string[];
}

interface FriendData {
  id: string;
  name: string;
  email: string;
}

export const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [friendCode, setFriendCode] = useState('');
  const [friends, setFriends] = useState<FriendData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (user?.uid) {
      try {
        setLoading(true);
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const userData = docSnap.data() as UserProfile;
          setProfile(userData);
          
          // Fetch friend details
          if (userData.friends && userData.friends.length > 0) {
            const friendPromises = userData.friends.map(friendId => 
              getDoc(doc(db, 'users', friendId))
            );
            
            const friendSnapshots = await Promise.all(friendPromises);
            const friendData = friendSnapshots
              .filter(snap => snap.exists())
              .map(snap => ({
                id: snap.id,
                ...(snap.data() as { name: string; email: string })
              }));
            
            setFriends(friendData);

            // Pre-load friend data for widgets
            friendData.forEach(friend => {
              prepareFriendWidgetData(friend.id)
                .catch(err => console.error(`Error preparing widget data for ${friend.name}:`, err));
            });
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        Alert.alert('Error', 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    }
  };

  const copyFriendCode = async () => {
    if (profile?.friendCode) {
      await Clipboard.setStringAsync(profile.friendCode);
      Alert.alert('Success', 'Friend code copied to clipboard!');
    }
  };

  const addFriend = async () => {
    if (!friendCode.trim()) {
      Alert.alert('Error', 'Please enter a friend code');
      return;
    }

    try {
      setLoading(true);
      // Find user with this friend code
      const q = query(collection(db, 'users'), where('friendCode', '==', friendCode));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        Alert.alert('Error', 'No user found with this friend code');
        return;
      }

      const friendDoc = querySnapshot.docs[0];
      if (friendDoc.id === user?.uid) {
        Alert.alert('Error', 'You cannot add yourself as a friend');
        return;
      }

      // Check if already friends
      if (profile?.friends.includes(friendDoc.id)) {
        Alert.alert('Error', 'This user is already your friend');
        return;
      }

      // Add friend to both users
      await updateDoc(doc(db, 'users', user!.uid), {
        friends: arrayUnion(friendDoc.id)
      });

      await updateDoc(doc(db, 'users', friendDoc.id), {
        friends: arrayUnion(user!.uid)
      });

      Alert.alert('Success', 'Friend added successfully!');
      setFriendCode('');
      loadProfile(); // Reload profile to show new friend
    } catch (error) {
      console.error('Error adding friend:', error);
      Alert.alert('Error', 'Failed to add friend');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Navigation will be handled automatically by RootNavigator
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.userCard}>
        <Text style={styles.title}>{profile?.name || 'User'}</Text>
        <View style={styles.codeContainer}>
          <Text style={styles.subtitle}>Friend Code: {profile?.friendCode || 'N/A'}</Text>
          <TouchableOpacity style={styles.copyButton} onPress={copyFriendCode}>
            <Text style={styles.copyButtonText}>Copy</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.addFriendCard}>
        <Text style={styles.sectionTitle}>Add Friend</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter friend code"
          value={friendCode}
          onChangeText={setFriendCode}
          autoCapitalize="none"
        />
        <TouchableOpacity 
          style={[styles.addButton, loading && styles.disabledButton]} 
          onPress={addFriend}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Add Friend</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.friendsCard}>
        <View style={styles.friendsHeader}>
          <Text style={styles.sectionTitle}>Friends</Text>
          <Text>Total: {friends.length}</Text>
        </View>
        
        {loading ? (
          <ActivityIndicator size="large" color="#ff6b6b" />
        ) : (
          friends.map((friend) => (
            <View key={friend.id} style={styles.friendItem}>
              <Text style={styles.friendName}>{friend.name}</Text>
              <Text style={styles.friendEmail}>{friend.email}</Text>
            </View>
          ))
        )}
        
        {!loading && friends.length === 0 && (
          <Text style={styles.noFriendsText}>No friends added yet</Text>
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  userCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  addFriendCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  friendsCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  friendsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  copyButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 5,
  },
  copyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  friendItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  friendEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  noFriendsText: {
    textAlign: 'center',
    color: '#666',
    padding: 20,
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  logoutText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.7,
  },
}); 