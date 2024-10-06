/*
import React, { useState, useEffect } from 'react';
import { getFirestore } from 'firebase/firestore';
import { useAuth } from '../../contexts/authContext';
import { collection, doc, updateDoc, onSnapshot } from "firebase/firestore";
import "../../App.css";

function CategoryList() {
  const { currentUser } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [editing, setEditing] = useState({}); // Track which document is being edited
  const [showModal, setShowModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [newStatName, setNewStatName] = useState('');
  const [newStatValue, setNewStatValue] = useState('');
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

  const handleStatChange = (docId, statKey, newValue) => {
    setEditing(prevEditing => ({ ...prevEditing, [docId]: { ...prevEditing[docId], [statKey]: newValue } }));
  };

  const handleUpdate = (docId, statKey) => {
    const docRef = doc(db, 'Category', docId);
    const updatedData = { stats: { ...documents.find(doc => doc.id === docId).stats, [statKey]: editing[docId][statKey] } };
    updateDoc(docRef, updatedData)
      .then(() => {
        console.log("Document updated successfully");
        setEditing(prevEditing => ({ ...prevEditing, [docId]: undefined })); // Reset editing state
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
      });
  };

  const handleKeyPress = (event, docId, statKey) => {
    if (event.key === 'Enter') {
      handleUpdate(docId, statKey);
    }
  };

  const handleBlur = (docId, statKey) => {
    setEditing(prevEditing => ({ ...prevEditing, [docId]: undefined })); // Reset editing state
  };

  const handleAddStat = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setShowModal(true);
  };

  const handleModalSubmit = () => {
    if (newStatName && newStatValue) {
      const docRef = doc(db, 'Category', selectedCategoryId);
      const updatedData = { 
        stats: { 
          ...documents.find(doc => doc.id === selectedCategoryId).stats,
          [newStatName]: newStatValue 
        }
      };
      updateDoc(docRef, updatedData)
        .then(() => {
          console.log("New stat added successfully");
          setShowModal(false);
          setNewStatName('');
          setNewStatValue('');
        })
        .catch((error) => {
          console.error("Error adding new stat: ", error);
        });
    }
  };

  return (
    <div className="dashboard">
      {documents.map(doc => (
        <div key={doc.id} className="category-card">
          <h3>{doc.name}</h3>
          <div className="stats-container">
            {Object.entries(doc.stats).map(([key, value]) => (
              <div key={key} className="stat-input">
                <label>{key}: &nbsp;</label>
                <input
                  type="text"
                  value={editing[doc.id] && editing[doc.id][key] !== undefined ? editing[doc.id][key] : value}
                  onChange={(event) => handleStatChange(doc.id, key, event.target.value)}
                  onKeyPress={(event) => handleKeyPress(event, doc.id, key)}
                  onBlur={() => handleBlur(doc.id, key)}
                />
              </div>
            ))}
          </div>
          <button className="add-stat-button" onClick={() => handleAddStat(doc.id)}>Add New Stat</button>
          {showModal && selectedCategoryId === doc.id && (
            <div className="modal">
              <input 
                type="text" 
                placeholder="Stat Name" 
                value={newStatName}
                onChange={(e) => setNewStatName(e.target.value)}
              />
              <input 
                type="text" 
                placeholder="Initial Value" 
                value={newStatValue}
                onChange={(e) => setNewStatValue(e.target.value)}
              />
              <button className="submit-button" onClick={handleModalSubmit}>Submit</button>
              <button className="cancel-button" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default CategoryList;
*/
'use client'

import React, { useState, useEffect } from 'react'
import { getFirestore, collection, doc, updateDoc, onSnapshot, query, where } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

// Simplified UI components
const Card = ({ children }) => (
  <div className="bg-white shadow-md rounded-lg p-4 m-2">{children}</div>
)

const Button = ({ children, onClick, className = "" }) => (
  <button
    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
)

const Input = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
)

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        {children}
        <Button onClick={onClose} className="mt-4">Close</Button>
      </div>
    </div>
  )
}

export default function CategoryList() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [newStatName, setNewStatName] = useState('')
  const [newStatValue, setNewStatValue] = useState('')
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const auth = getAuth()
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      if (user) {
        fetchUserCategories(user.uid)
      } else {
        setDocuments([])
        setLoading(false)
      }
    })

    return () => unsubscribeAuth()
  }, [])

  const fetchUserCategories = (userId) => {
    const db = getFirestore()
    const colRef = collection(db, 'Category')
    const userCategoriesQuery = query(colRef, where("user_id", "==", userId))

    const unsubscribe = onSnapshot(userCategoriesQuery, 
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        setDocuments(docs)
        setLoading(false)
      },
      (err) => {
        console.error("Error fetching documents: ", err)
        setError("Failed to fetch categories. Please try again later.")
        setLoading(false)
      }
    )

    return unsubscribe
  }

  const handleAddStat = (categoryId) => {
    setSelectedCategoryId(categoryId)
    setShowModal(true)
  }

  const handleModalSubmit = () => {
    if (newStatName && newStatValue) {
      const db = getFirestore()
      const docRef = doc(db, 'Category', selectedCategoryId)
      const updatedData = { 
        stats: { 
          ...documents.find(doc => doc.id === selectedCategoryId).stats,
          [newStatName]: newStatValue 
        }
      }
      updateDoc(docRef, updatedData)
        .then(() => {
          console.log("New stat added successfully")
          setShowModal(false)
          setNewStatName('')
          setNewStatValue('')
        })
        .catch((error) => {
          console.error("Error adding new stat: ", error)
        })
    }
  }

  if (loading) {
    return <div className="text-center p-4">Loading...</div>
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>
  }

  if (!currentUser) {
    return <div className="text-center p-4">Please log in to view your categories.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Categories</h1>
      {documents.length === 0 ? (
        <p>No categories found. Try adding some!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map(doc => (
            <Card key={doc.id}>
              <h2 className="text-xl font-semibold mb-2">{doc.name}</h2>
              <ul>
                {Object.entries(doc.stats || {}).map(([key, value]) => (
                  <li key={key} className="mb-1">
                    <span className="font-medium">{key}:</span> {value}
                  </li>
                ))}
              </ul>
              <Button onClick={() => handleAddStat(doc.id)} className="mt-2">
                Add Stat
              </Button>
            </Card>
          ))}
        </div>
      )}
      <div className="mt-4">
        <Button onClick={() => console.log('Add new category')}>
          Add New Category
        </Button>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2 className="text-xl font-bold mb-4">Add New Stat</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stat Name
          </label>
          <Input
            value={newStatName}
            onChange={(e) => setNewStatName(e.target.value)}
            placeholder="Enter stat name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Initial Value
          </label>
          <Input
            value={newStatValue}
            onChange={(e) => setNewStatValue(e.target.value)}
            placeholder="Enter initial value"
          />
        </div>
        <Button onClick={handleModalSubmit}>Submit</Button>
      </Modal>
    </div>
  )
}