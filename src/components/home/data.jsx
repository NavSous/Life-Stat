'use client'

import React, { useState, useEffect } from 'react'
import { getFirestore, collection, doc, updateDoc, deleteDoc, deleteField, onSnapshot, query, where, addDoc } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { Trash2, Save, PlusCircle, CheckCircle, XCircle, Search } from 'lucide-react'

// Updated Modal component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
          <button type="submit" form="modalForm" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add</button>
        </div>
      </div>
    </div>
  )
}

// Simplified ConfirmDialog component
const ConfirmDialog = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
          <button onClick={onConfirm} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
        </div>
      </div>
    </div>
  )
}

export default function CategoryList() {
  // State variables
  const [documents, setDocuments] = useState([])
  const [filteredDocuments, setFilteredDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [modalState, setModalState] = useState({ isOpen: false, type: null, data: {} })
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, message: '', onConfirm: null })
  const [editing, setEditing] = useState({})

  // Effect hook to handle authentication and fetch user categories
  useEffect(() => {
    const auth = getAuth()
    const unsubscribeAuth = onAuthStateChanged(auth, user => {
      setCurrentUser(user)
      if (user) fetchUserCategories(user.uid)
      else {
        setDocuments([])
        setFilteredDocuments([])
        setLoading(false)
      }
    })
    return () => unsubscribeAuth()
  }, [])

  // Effect hook to filter documents based on search term
  useEffect(() => {
    const filtered = documents.filter(doc =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredDocuments(filtered)
  }, [documents, searchTerm])

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

    return unsubscribe
  }

  // Function to handle adding or updating a stat or goal
  const handleAddOrUpdate = (type, categoryId, data) => {
    const db = getFirestore()
    const docRef = doc(db, 'Category', categoryId)
    const category = documents.find(doc => doc.id === categoryId)
    let updatedData = {}

    if (type === 'stat') {
      updatedData = { 
        stats: { 
          ...category.stats,
          [data.name]: data.value 
        }
      }
    } else if (type === 'goal') {
      const currentValue = category.stats[data.stat] || '0'
      const newGoal = {
        name: data.name,
        stat: data.stat,
        currentValue: currentValue,
        targetValue: data.target,
        achieved: parseFloat(currentValue) >= parseFloat(data.target)
      }
      updatedData = { 
        goals: { 
          ...category.goals,
          [data.name]: newGoal 
        }
      }
    }

    updateDoc(docRef, updatedData)
      .then(() => {
        console.log(`${type} added/updated successfully`)
        setModalState({ isOpen: false, type: null, data: {} })
      })
      .catch((error) => {
        console.error(`Error adding/updating ${type}: `, error)
      })
  }

  // Function to handle deleting a stat, goal, or category
  const handleDelete = (type, categoryId, itemName) => {
    const db = getFirestore()
    const docRef = doc(db, 'Category', categoryId)

    if (type === 'category') {
      deleteDoc(docRef)
        .then(() => console.log("Category deleted successfully"))
        .catch((error) => console.error("Error deleting category: ", error))
    } else {
      const updatedData = { 
        [`${type}s.${itemName}`]: deleteField()
      }
      updateDoc(docRef, updatedData)
        .then(() => console.log(`${type} deleted successfully`))
        .catch((error) => console.error(`Error deleting ${type}: `, error))
    }
  }

  // Function to show confirmation dialog
  const showDeleteConfirmation = (type, categoryId, itemName) => {
    setConfirmDialog({
      isOpen: true,
      message: `Are you sure you want to delete this ${type}?`,
      onConfirm: () => {
        handleDelete(type, categoryId, itemName)
        setConfirmDialog({ isOpen: false, message: '', onConfirm: null })
      }
    })
  }

  // Function to handle stat change
  const handleStatChange = (categoryId, statKey, newValue) => {
    setEditing(prev => ({
      ...prev,
      [categoryId]: { ...prev[categoryId], [statKey]: newValue }
    }))
  }

  // Function to handle stat update
  const handleStatUpdate = (categoryId, statKey) => {
    const db = getFirestore()
    const docRef = doc(db, 'Category', categoryId)
    const category = documents.find(doc => doc.id === categoryId)
    const updatedData = {
      stats: {
        ...category.stats,
        [statKey]: editing[categoryId][statKey]
      }
    }
    updateDoc(docRef, updatedData)
      .then(() => {
        console.log("Stat updated successfully")
        setEditing(prev => ({ ...prev, [categoryId]: { ...prev[categoryId], [statKey]: undefined } }))
        updateGoalsForStat(categoryId, statKey, editing[categoryId][statKey])
      })
      .catch((error) => {
        console.error("Error updating stat: ", error)
      })
  }

  // Function to update goals when associated stat changes
  const updateGoalsForStat = (categoryId, statKey, newValue) => {
    const db = getFirestore()
    const docRef = doc(db, 'Category', categoryId)
    const category = documents.find(doc => doc.id === categoryId)
    const updatedGoals = { ...category.goals }
    
    Object.entries(category.goals).forEach(([goalName, goal]) => {
      if (goal.stat === statKey) {
        updatedGoals[goalName] = {
          ...goal,
          currentValue: newValue,
          achieved: parseFloat(newValue) >= parseFloat(goal.targetValue)
        }
      }
    })

    updateDoc(docRef, { goals: updatedGoals })
      .then(() => console.log("Goals updated successfully"))
      .catch((error) => console.error("Error updating goals: ", error))
  }

  // Function to calculate goal progress percentage
  const calculateGoalProgress = (currentValue, targetValue) => {
    const current = parseFloat(currentValue)
    const target = parseFloat(targetValue)
    if (isNaN(current) || isNaN(target) || target === 0) return 0
    return Math.min(Math.round((current / target) * 100), 100)
  }

  // Function to handle adding a new category
  const handleAddCategory = (name) => {
    if (name && currentUser) {
      const db = getFirestore()
      const categoryRef = collection(db, 'Category')
      addDoc(categoryRef, {
        name: name,
        user_id: currentUser.uid,
        stats: {},
        goals: {}
      })
        .then(() => {
          console.log("New category added successfully")
          setModalState({ isOpen: false, type: null, data: {} })
        })
        .catch((error) => {
          console.error("Error adding new category: ", error)
        })
    }
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Categories</h1>
      
      <div className="mb-6 flex items-center space-x-4">
        <div className="flex-grow flex items-center space-x-2 bg-white rounded-md shadow-sm">
          <Search className="text-gray-400 ml-3" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow px-3 py-2 focus:outline-none"
          />
        </div>
        <button 
          onClick={() => setModalState({ isOpen: true, type: 'category', data: {} })} 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <PlusCircle className="mr-2" size={20} />
          Add Category
        </button>
      </div>

      {filteredDocuments.length === 0 ? (
        <p className="text-center text-gray-500">No categories found. Try adding some!</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map(doc => (
            <div key={doc.id} className="bg-white shadow-lg rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-gray-800">{doc.name}</h2>
                  <button
                    onClick={() => showDeleteConfirmation('category', doc.id, doc.name)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Stats</h3>
                    <ul className="space-y-2">
                      {Object.entries(doc.stats || {}).map(([key, value]) => (
                        <li key={key} className="flex justify-between items-center">
                          <span className="font-medium text-gray-600">{key}:</span>
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={editing[doc.id]?.[key] ?? value}
                              onChange={(e) => handleStatChange(doc.id, key, e.target.value)}
                              onBlur={() => handleStatUpdate(doc.id, key)}
                              className="w-24 border border-gray-300 rounded-md px-2 py-1 text-right"
                            />
                            <button
                              onClick={() => showDeleteConfirmation('stat', doc.id, key)}
                              className="text-red-500 hover:text-red-700 transition-colors duration-200"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <button 
                      onClick={() => setModalState({ isOpen: true, type: 'stat', data: { categoryId: doc.id } })}
                      className="mt-2 text-blue-500 hover:text-blue-600 font-medium flex items-center"
                    >
                      <PlusCircle size={16} className="mr-1" /> Add Stat
                    </button>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Goals</h3>
                    <ul className="space-y-4">
                      {Object.entries(doc.goals || {}).map(([key, goal]) => (
                        <li key={key} className="border rounded-md p-4 bg-gray-50">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-700">{goal.name}</span>
                            <button
                              onClick={() => showDeleteConfirmation('goal', doc.id, key)}
                              className="text-red-500 hover:text-red-700 transition-colors duration-200"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="text-sm text-gray-600">Stat: {goal.stat}</div>
                          <div className="text-sm text-gray-600">Current: {goal.currentValue}</div>
                          <div className="text-sm text-gray-600">Target: {goal.targetValue}</div>
                          <div className="mt-2">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                                  style={{width: `${calculateGoalProgress(goal.currentValue, goal.targetValue)}%`}}
                                ></div>
                              </div>
                              <span className="ml-2 text-sm text-gray-600">{calculateGoalProgress(goal.currentValue, goal.targetValue)}%</span>
                            </div>
                          </div>
                          <div className="mt-2">
                            {goal.achieved ? (
                              <span className="text-green-500 flex items-center text-sm">
                                Achieved <CheckCircle size={16} className="ml-1" />
                              </span>
                            ) : (
                              <span className="text-red-500 flex items-center text-sm">
                                Not Achieved <XCircle size={16} className="ml-1" />
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                    <button 
                      onClick={() => setModalState({ isOpen: true, type: 'goal', data: { categoryId: doc.id } })}
                      className="mt-2 text-blue-500 hover:text-blue-600 font-medium flex items-center"
                    >
                      <PlusCircle size={16} className="mr-1" /> Add Goal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal 
        isOpen={modalState.isOpen} 
        onClose={() => setModalState({ isOpen: false, type: null, data: {} })}
        title={`Add New ${modalState.type === 'category' ? 'Category' : modalState.type === 'stat' ? 'Stat' : 'Goal'}`}
      >
        {modalState.type === 'category' && (
          <CategoryForm onSubmit={handleAddCategory} />
        )}
        {modalState.type === 'stat' && (
          <StatForm onSubmit={(data) => handleAddOrUpdate('stat', modalState.data.categoryId, data)} />
        )}
        {modalState.type === 'goal' && (
          <GoalForm 
            onSubmit={(data) => handleAddOrUpdate('goal', modalState.data.categoryId, data)}
            stats={documents.find(doc => doc.id === modalState.data.categoryId)?.stats || {}}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, message: '', onConfirm: null })}
        onConfirm={confirmDialog.onConfirm}
        message={confirmDialog.message}
      />
    </div>
  )
}

// Updated form components
const CategoryForm = ({ onSubmit }) => {
  const [name, setName] = useState('')
  return (
    <form id="modalForm" onSubmit={(e) => { e.preventDefault(); onSubmit(name); }}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter category name"
        className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
      />
    </form>
  )
}

const StatForm = ({ onSubmit }) => {
  const [name, setName] = useState('')
  const [value, setValue] = useState('')
  return (
    <form id="modalForm" onSubmit={(e) => { e.preventDefault(); onSubmit({ name, value }); }}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter stat name"
        className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter initial value"
        className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
      />
    </form>
  )
}

const GoalForm = ({ onSubmit, stats }) => {
  const [name, setName] = useState('')
  const [stat, setStat] = useState('')
  const [target, setTarget] = useState('')
  return (
    <form id="modalForm" onSubmit={(e) => { e.preventDefault(); onSubmit({ name, stat, target }); }}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter goal name"
        className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
      />
      <select
        value={stat}
        onChange={(e) => setStat(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
      >
        <option value="">Select a stat</option>
        {Object.keys(stats).map(statName => (
          <option key={statName} value={statName}>{statName}</option>
        ))}
      </select>
      <input
        type="text"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        placeholder="Enter target value"
        className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
      />
    </form>
  )
}