'use client'

import React, { useState, useEffect } from 'react'
import { getFirestore, collection, doc, updateDoc, deleteDoc, deleteField, onSnapshot, query, where } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { Trash2 } from 'lucide-react'

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg">
        {children}
        <Button onClick={onClose} className="mt-4">Close</Button>
      </div>
    </div>
  )
}

const ConfirmDialog = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose} className="bg-gray-500">Cancel</Button>
          <Button onClick={onConfirm} className="bg-red-500">Delete</Button>
        </div>
      </div>
    </div>
  )
}

export default function CategoryList() {
  // State variables
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [newStatName, setNewStatName] = useState('')
  const [newStatValue, setNewStatValue] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)
  const [confirmMessage, setConfirmMessage] = useState('')

  // Effect hook to handle authentication and fetch user categories
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

    // Cleanup function to unsubscribe from the auth listener
    return () => unsubscribeAuth()
  }, [])

  // Function to fetch user-specific categories
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

    // Return the unsubscribe function
    return unsubscribe
  }

  // Function to handle adding a new stat
  const handleAddStat = (categoryId) => {
    setSelectedCategoryId(categoryId)
    setShowModal(true)
  }

  // Function to handle submitting a new stat
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

  // Function to handle deleting a stat
  const handleDeleteStat = (categoryId, statName) => {
    const db = getFirestore()
    const docRef = doc(db, 'Category', categoryId)
    const updatedData = { 
      [`stats.${statName}`]: deleteField()
    }
    updateDoc(docRef, updatedData)
      .then(() => {
        console.log("Stat deleted successfully")
      })
      .catch((error) => {
        console.error("Error deleting stat: ", error)
      })
  }

  // Function to handle deleting a category
  const handleDeleteCategory = (categoryId) => {
    const db = getFirestore()
    const docRef = doc(db, 'Category', categoryId)
    deleteDoc(docRef)
      .then(() => {
        console.log("Category deleted successfully")
      })
      .catch((error) => {
        console.error("Error deleting category: ", error)
      })
  }

  // Function to show confirmation dialog
  const showDeleteConfirmation = (action, message) => {
    setConfirmAction(() => action)
    setConfirmMessage(message)
    setShowConfirmDialog(true)
  }

  // Function to handle confirmation
  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction()
    }
    setShowConfirmDialog(false)
  }

  // Render loading state
  if (loading) {
    return <div className="text-center p-4">Loading...</div>
  }

  // Render error state
  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>
  }

  // Render login prompt if no user is authenticated
  if (!currentUser) {
    return <div className="text-center p-4">Please log in to view your categories.</div>
  }

  // Main render
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Categories</h1>
      {documents.length === 0 ? (
        <p>No categories found. Try adding some!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map(doc => (
            <Card key={doc.id}>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">{doc.name}</h2>
                <button 
                  onClick={() => showDeleteConfirmation(
                    () => handleDeleteCategory(doc.id),
                    `Are you sure you want to delete the category "${doc.name}"?`
                  )}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <ul>
                {Object.entries(doc.stats || {}).map(([key, value]) => (
                  <li key={key} className="mb-1 flex justify-between items-center">
                    <span>
                      <span className="font-medium">{key}:</span> {value}
                    </span>
                    <button 
                      onClick={() => showDeleteConfirmation(
                        () => handleDeleteStat(doc.id, key),
                        `Are you sure you want to delete the stat "${key}"?`
                      )}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
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
        <a href="/make_category" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Add New Category
        </a>
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

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirm}
        message={confirmMessage}
      />
    </div>
  )
}