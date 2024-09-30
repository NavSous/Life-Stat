import React, { useState } from 'react';
import { useAuth } from '../../contexts/authContext';
import { getFirestore } from 'firebase/firestore'
import { collection, addDoc } from "firebase/firestore"; 

const MakeCategory = () => {
  const { currentUser } = useAuth();
  const [name, setName] = useState('');
  const db = getFirestore();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "Category"), {
        name: name,
        stats: {},
        user_id: currentUser.uid,
      });
      console.log("Document written with ID: ", docRef.id);
      window.location.href = "/"
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  if (currentUser !== null) {
    return (
      <div className='text-2xl font-bold pt-14' style={{marginLeft: '5vw'}}>
        Create Category
        <form onSubmit={onSubmit}>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Enter Category Name"
          />
          <button type="submit">Create</button>
        </form>
      </div>
    )
  } else {
    return (
      <div className='text-2xl font-bold pt-14' style={{marginLeft: '5vw'}}>
        You need to be logged in to create a category
      </div>
    )
  }
}

export default MakeCategory;