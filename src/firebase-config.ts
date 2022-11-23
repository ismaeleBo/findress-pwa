import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyCMVvB2hN79lz-4MoLSbCaPZfcnMoDZo6Q',
  authDomain: 'findress-e577d.firebaseapp.com',
  projectId: 'findress-e577d',
  storageBucket: 'findress-e577d.appspot.com',
  messagingSenderId: '540603963345',
  appId: '1:540603963345:web:c63b629b621f8d0eba72f0',
  measurementId: 'G-XK1YJ1ZMHQ',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
