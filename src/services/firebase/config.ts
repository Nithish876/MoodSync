import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
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
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }; 