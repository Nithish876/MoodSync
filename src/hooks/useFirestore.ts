import { useState } from 'react';
import { collection, query, where, getDocs, WhereFilterOp, doc, getDoc, addDoc, updateDoc, deleteDoc, Query, DocumentData, CollectionReference } from 'firebase/firestore';
import { db } from '../services/firebase/config';

type WhereClause = {
  field: string;
  operator: WhereFilterOp;
  value: any;
};

export const useFirestore = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDocuments = async (collectionName: string, whereFilters: WhereClause[] = []) => {
    setLoading(true);
    setError(null);
    
    try {
      let collectionRef: CollectionReference = collection(db, collectionName);
      let q: Query<DocumentData> = collectionRef;
      
      if (whereFilters.length > 0) {
        const filters = whereFilters.map(filter => 
          where(filter.field, filter.operator, filter.value)
        );
        q = query(collectionRef, ...filters);
      }
      
      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setLoading(false);
      return documents;
    } catch (err) {
      console.error('Error getting documents:', err);
      setError('Failed to fetch documents');
      setLoading(false);
      return [];
    }
  };

  const getDocument = async (collectionName: string, documentId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const docRef = doc(db, collectionName, documentId);
      const docSnap = await getDoc(docRef);
      
      setLoading(false);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (err) {
      console.error('Error getting document:', err);
      setError('Failed to fetch document');
      setLoading(false);
      return null;
    }
  };

  return {
    getDocuments,
    getDocument,
    loading,
    error
  };
}; 