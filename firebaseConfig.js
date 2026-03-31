import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA1unJKzC931YQFpzeWV_xY9ks8-wbw9qE",
  authDomain: "barberconnect-e5fd0.firebaseapp.com",
  projectId: "barberconnect-e5fd0",
  storageBucket: "barberconnect-e5fd0.firebasestorage.app",
  messagingSenderId: "574933300093",
  appId: "1:574933300093:web:a8172af8aeb2d097aa9214",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);