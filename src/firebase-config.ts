import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyC9DYK8WOFpBXX7fofV__jC5hOebsSDsUQ',
  authDomain: 'findress-9b6b9.firebaseapp.com',
  projectId: 'findress-9b6b9',
  storageBucket: 'findress-9b6b9.appspot.com',
  messagingSenderId: '819953521954',
  appId: '1:819953521954:web:981c3f241ee1fd96ee017b',
  measurementId: 'G-KEBFXX2JB1',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
