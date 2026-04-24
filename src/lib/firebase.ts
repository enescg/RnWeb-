import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAZnrmWK7ju8ODNFQcqRoIV470S_gVD0JU",
  authDomain: "rnweb-74833.firebaseapp.com",
  projectId: "rnweb-74833",
  storageBucket: "rnweb-74833.firebasestorage.app",
  messagingSenderId: "666133636863",
  appId: "1:666133636863:web:3abf2bfeacb52ff9814eca",
  measurementId: "G-3MWP7EYQJR"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
