import React, { useState, useEffect } from 'react';
import { getFirestore } from 'firebase/firestore';
import { useAuth } from '../../contexts/authContext';
import { collection, addDoc, onSnapshot } from "firebase/firestore"; 


function CategoryList() {
  const { currentUser } = useAuth();
  const [documents, setDocuments] = useState([]);
  const db = getFirestore();
  const colRef = collection(db, 'Category');
  useEffect(() => {
    const unsubscribe = onSnapshot(colRef, snapshot => {
        const docs = snapshot.docs.filter(doc => doc.data().user_id === currentUser.uid)
        .map(doc => ({
          id: doc.id,
          ...doc.data(), // Spread the document data
        }));
        setDocuments(docs);
      });

    return unsubscribe; // Cleanup on component unmount
  }, [currentUser]); // Re-run the effect when the current user changes

  return (
    <div>
      <ul>
        {documents.map(doc => (
          <li key={doc.id}>
            <h3>{doc.name}</h3> <h3>{doc.user_id}</h3>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryList;