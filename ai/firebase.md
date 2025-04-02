// First, install these dependencies:
// npm install firebase @react-native-firebase/app @react-native-firebase/auth expo-dev-client @types/firebase
// expo install expo-auth-session expo-web-browser

## 1. Create firebase.config.ts

import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
apiKey: "AIzaSyD-aN5SXO1EjpSMfWs2V6GudAdkXFiA6qE",
authDomain: "mood-sync-app.firebaseapp.com",
projectId: "mood-sync-app",
storageBucket: "mood-sync-app.firebasestorage.app",
messagingSenderId: "733031349243",
appId: "1:733031349243:web:b71eb7f50fa6414371e95e",
measurementId: "G-86SD9QVKPV"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth };

## 2. Create types/auth.types.ts

export interface User {
uid: string;
email: string | null;
displayName: string | null;
photoURL: string | null;
}

export interface AuthState {
user: User | null;
loading: boolean;
error: string | null;
}

## 3. Create hooks/useAuth.ts

import { useState, useEffect } from 'react';
import {
signInWithEmailAndPassword,
createUserWithEmailAndPassword,
signInAnonymously,
signOut,
onAuthStateChanged,
User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../firebase.config';
import { AuthState, User } from '../types/auth.types';

export const useAuth = () => {
const [authState, setAuthState] = useState<AuthState>({
user: null,
loading: true,
error: null,
});

useEffect(() => {
const unsubscribe = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
if (user) {
const mappedUser: User = {
uid: user.uid,
email: user.email,
displayName: user.displayName,
photoURL: user.photoURL,
};
setAuthState({ user: mappedUser, loading: false, error: null });
} else {
setAuthState({ user: null, loading: false, error: null });
}
});

    return unsubscribe;

}, []);

const signInWithEmail = async (email: string, password: string) => {
try {
setAuthState(prev => ({ ...prev, loading: true, error: null }));
await signInWithEmailAndPassword(auth, email, password);
} catch (error: any) {
setAuthState(prev => ({
...prev,
loading: false,
error: error.message,
}));
}
};

const signUpWithEmail = async (email: string, password: string) => {
try {
setAuthState(prev => ({ ...prev, loading: true, error: null }));
await createUserWithEmailAndPassword(auth, email, password);
} catch (error: any) {
setAuthState(prev => ({
...prev,
loading: false,
error: error.message,
}));
}
};

const signInAsGuest = async () => {
try {
setAuthState(prev => ({ ...prev, loading: true, error: null }));
await signInAnonymously(auth);
} catch (error: any) {
setAuthState(prev => ({
...prev,
loading: false,
error: error.message,
}));
}
};

const logout = async () => {
try {
await signOut(auth);
} catch (error: any) {
setAuthState(prev => ({
...prev,
error: error.message,
}));
}
};

return {
user: authState.user,
loading: authState.loading,
error: authState.error,
signInWithEmail,
signUpWithEmail,
signInAsGuest,
logout,
};
};

## 4. Create components/AuthScreen.tsx

import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export const AuthScreen: React.FC = () => {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const { signInWithEmail, signUpWithEmail, signInAsGuest, error, loading } = useAuth();

const handleSignIn = () => {
signInWithEmail(email, password);
};

const handleSignUp = () => {
signUpWithEmail(email, password);
};

return (
<View style={styles.container}>
<TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
<TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
<Button title="Sign In" onPress={handleSignIn} disabled={loading} />
<Button title="Sign Up" onPress={handleSignUp} disabled={loading} />
<Button title="Continue as Guest" onPress={signInAsGuest} disabled={loading} />
{error && <Text style={styles.error}>{error}</Text>}
</View>
);
};

const styles = StyleSheet.create({
container: {
flex: 1,
justifyContent: 'center',
padding: 20,
},
input: {
height: 40,
borderColor: 'gray',
borderWidth: 1,
marginBottom: 10,
paddingHorizontal: 10,
},
error: {
color: 'red',
marginTop: 10,
},
});

## 5. Usage in App.tsx

"
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from './hooks/useAuth';
import { AuthScreen } from './components/AuthScreen';
import { HomeScreen } from './components/HomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
const { user, loading } = useAuth();
if (loading) {
return <LoadingScreen />;
}
return (
<NavigationContainer>
<Stack.Navigator>
{user ? (
<Stack.Screen name="Home" component={HomeScreen} />
) : (
<Stack.Screen name="Auth" component={AuthScreen} />
)}
</Stack.Navigator>
</NavigationContainer>
);
}
"

---

First, install the required dependencies

```
npx expo install firebase @react-native-firebase/app @react-native-firebase/auth
npx expo install expo-auth-session expo-web-browser @react-native-async-storage/async-storage
npm install @react-navigation/native @react-navigation/native-stack
```

Configure your app.json for Expo

{
"expo": {
"scheme": "your-scheme",
"web": {
"config": {
"firebase": {
// Your web firebase config here
}
}
}
}
}

---

#### my working previous code:

Working firebaseConfig.ts

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
apiKey: "AIzaSyD-aN5SXO1EjpSMfWs2V6GudAdkXFiA6qE",
authDomain: "mood-sync-app.firebaseapp.com",
projectId: "mood-sync-app",
storageBucket: "mood-sync-app.firebasestorage.app",
messagingSenderId: "733031349243",
appId: "1:733031349243:web:b71eb7f50fa6414371e95e",
measurementId: "G-86SD9QVKPV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

Auth.ts
import { auth } from './config';
import { signInAnonymously } from 'firebase/auth';

export const signInAsGuest = async () => {
try {
const userCredential = await signInAnonymously(auth);
return userCredential.user;
} catch (error) {
console.error('Error signing in as guest:', error);
throw error;
}
};UseAuth.tsimport { useState, useEffect } from 'react';
import { auth } from '../services/firebase/config';
import { onAuthStateChanged, User } from 'firebase/auth';

export const useAuth = () => {
const [user, setUser] = useState<User | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
const unsubscribe = onAuthStateChanged(auth, (user) => {
setUser(user);
setLoading(false);
});

    return unsubscribe;

}, []);

return { user, loading };
};

LoginScreen.tsximport React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { signInAsGuest } from '../../services/firebase/auth';

export const LoginScreen = ({ navigation }) => {
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

const handleGuestLogin = async () => {
try {
setLoading(true);
setError('');
const user = await signInAsGuest();
console.log('Signed in as guest:', user.uid);
// Navigation will be handled by your navigation container based on auth state
} catch (err) {
setError('Failed to sign in as guest');
console.error(err);
} finally {
setLoading(false);
}
};

return (
<View style={styles.container}>
<Text style={styles.title}>MoodSync</Text>
{error ? <Text style={styles.error}>{error}</Text> : null}
<TouchableOpacity 
        style={styles.button} 
        onPress={handleGuestLogin}
        disabled={loading}
      >
{loading ? (
<ActivityIndicator color="#fff" />
) : (
<Text style={styles.buttonText}>Continue as Guest</Text>
)}
</TouchableOpacity>
</View>
);
};

const styles = StyleSheet.create({
container: {
flex: 1,
justifyContent: 'center',
alignItems: 'center',
padding: 20,
},
title: {
fontSize: 24,
fontWeight: 'bold',
marginBottom: 20,
},
button: {
backgroundColor: '#007AFF',
padding: 15,
borderRadius: 8,
width: '100%',
alignItems: 'center',
},
buttonText: {
color: '#fff',
fontSize: 16,
fontWeight: '600',
},
error: {
color: 'red',
marginBottom: 10,
},
});
