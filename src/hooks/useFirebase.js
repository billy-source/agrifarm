import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

export const useFirestore = (collectionName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setData([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, collectionName),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setData(items);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [collectionName, currentUser]);

  const addItem = async (item) => {
    if (!currentUser) throw new Error('User not authenticated');
    
    try {
      await addDoc(collection(db, collectionName), {
        ...item,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateItem = async (id, updates) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { data, loading, error, addItem, updateItem, deleteItem };
};