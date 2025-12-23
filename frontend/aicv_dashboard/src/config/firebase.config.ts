import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase configuration
// TODO: Replace with your Firebase project credentials
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
//   databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || '',
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
//   appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
// };

const firebaseConfig = {
  apiKey: 'AIzaSyAveuIvUKTJ7_w9MWZyxOAcDG70hGenLKY',
  authDomain: 'cxview-dashboard.firebaseapp.com',
  databaseURL: 'https://cxview-dashboard-default-rtdb.firebaseio.com',
  projectId: 'cxview-dashboard',
  storageBucket: 'cxview-dashboard.firebasestorage.app',
  messagingSenderId: '497985752620',
  appId: '1:497985752620:web:6b810a7a57d362ee520b89',
  measurementId: 'G-4DWE5Z615M',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
export const database = getDatabase(app);

export default app;
