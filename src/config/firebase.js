import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAfHCMkQNCu1qR7h_RVuadXtpdZ3-PfGAI",
  authDomain: "agritracker-bbf50.firebaseapp.com",
  projectId: "agritracker-bbf50",
  storageBucket: "agritracker-bbf50.firebasestorage.app",
  messagingSenderId: "684177277102",
  appId: "1:684177277102:web:9d008f9c64b4a3cdbd2d3f",
  measurementId: "G-JW7P8SP4HJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;