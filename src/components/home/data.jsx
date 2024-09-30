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