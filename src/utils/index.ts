import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';

export const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const getUserByUID = async (uid: string) => {
  const collectionRef = collection(db, 'users');
  try {
    const res = await getDocs(collectionRef);

    const users = res.docs.map((doc) => ({ data: doc.data(), id: doc.id }));
    const currentUser = users.filter((el) => {
      return el.data.uid === uid;
    });

    return currentUser[0].data;
  } catch (err) {
    console.log(err);
  }
};
