'use client'

import React, { useState, useEffect } from 'react'
import { getFirestore, collection, doc, updateDoc, deleteDoc, deleteField, onSnapshot, query, where, addDoc } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { Trash2, Save, PlusCircle, CheckCircle, XCircle, Search } from 'lucide-react'
import '../../App.css'

// Simplified UI components
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg">
        {children}
        <button onClick={onClose} className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Close</button>
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
  const [showModal, setShowModal] = useState(false)
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [newStatName, setNewStatName] = useState('')
  const [newStatValue, setNewStatValue] = useState('')
  const [newGoalName, setNewGoalName] = useState('')
  const [newGoalStat, setNewGoalStat] = useState('')
  const [newGoalTarget, setNewGoalTarget] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)
  const [confirmMessage, setConfirmMessage] = useState('')
  const [editing, setEditing] = useState({})
  const [editingGoal, setEditingGoal] = useState({})
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryOrder, setCategoryOrder] = useState([])

  // Effect hook to handle authentication and fetch user categories
  useEffect(() => {
    const auth = getAuth()
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      if (user) {
        fetchUserCategories(user.uid)
      } else {
        setDocuments([])
        setFilteredDocuments([])
        setCategoryOrder([])
        setLoading(false)
      }
    })

    return () => unsubscribeAuth()
  }, [])

  // Effect hook to filter and sort documents based on search term and category order
  useEffect(() => {
    const filtered = documents.filter(doc =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    const sorted = [...filtered].sort((a, b) => 
      categoryOrder.indexOf(a.id) - categoryOrder.indexOf(b.id)
    )
    setFilteredDocuments(sorted)
  }, [documents, searchTerm, categoryOrder])

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
        
        // Set initial category order if not already set
        if (categoryOrder.length === 0) {
          const order = docs.map(doc => doc.id)
          setCategoryOrder(order)
          updateCategoryOrderInFirebase(order)
        }
        
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

  // Function to update category order in Firebase
  const updateCategoryOrderInFirebase = async (newOrder) => {
    if (!currentUser) return

    const db = getFirestore()
    const userDocRef = doc(db, 'Users', currentUser.uid)

    try {
      await updateDoc(userDocRef, { categoryOrder: newOrder })
      console.log("Category order updated successfully")
    } catch (error) {
      console.error("Error updating category order: ", error)
    }
  }

  // Function to handle drag end
  const onDragEnd = (result) => {
    if (!result.destination) return

    const newOrder = Array.from(categoryOrder)
    const [reorderedItem] = newOrder.splice(result.source.index, 1)
    newOrder.splice(result.destination.index, 0, reorderedItem)

    setCategoryOrder(newOrder)
    updateCategoryOrderInFirebase(newOrder)
  }
  // Effect hook to handle authentication and fetch user categories
  useEffect(() => {
    const auth = getAuth()
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      if (user) {
        fetchUserCategories(user.uid)
      } else {
        setDocuments([])
        setFilteredDocuments([])
        setLoading(false)
      }
    })

    // Cleanup function to unsubscribe from the auth listener
    return () => unsubscribeAuth()
  }, [])

  // Effect hook to filter documents based on search term
  useEffect(() => {
    const filtered = documents.filter(doc =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredDocuments(filtered)
  }, [documents, searchTerm])


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

  // Function to handle stat change
  const handleStatChange = (categoryId, statKey, newValue) => {
    setEditing(prevEditing => ({
      ...prevEditing,
      [categoryId]: { ...prevEditing[categoryId], [statKey]: newValue }
    }))
  }

  // Function to handle stat update
  const handleStatUpdate = (categoryId, statKey) => {
    const db = getFirestore()
    const docRef = doc(db, 'Category', categoryId)
    const updatedData = {
      stats: {
        ...documents.find(doc => doc.id === categoryId).stats,
        [statKey]: editing[categoryId][statKey]
      }
    }
    updateDoc(docRef, updatedData)
      .then(() => {
        console.log("Stat updated successfully")
        setEditing(prevEditing => ({ ...prevEditing, [categoryId]: { ...prevEditing[categoryId], [statKey]: undefined } }))
        // Update goals associated with this stat
        updateGoalsForStat(categoryId, statKey, editing[categoryId][statKey])
      })
      .catch((error) => {
        console.error("Error updating stat: ", error)
      })
  }

  // Function to handle key press
  const handleKeyPress = (event, categoryId, statKey) => {
    if (event.key === 'Enter') {
      handleStatUpdate(categoryId, statKey)
    }
  }

  // Function to handle blur
  const handleBlur = (categoryId, statKey) => {
    if (editing[categoryId] && editing[categoryId][statKey] !== undefined) {
      handleStatUpdate(categoryId, statKey)
    }
  }

  // Function to handle adding a new goal
  const handleAddGoal = (categoryId) => {
    setSelectedCategoryId(categoryId)
    setShowGoalModal(true)
  }

  // Function to handle submitting a new goal
  const handleGoalModalSubmit = () => {
    if (newGoalName && newGoalStat && newGoalTarget) {
      const db = getFirestore()
      const docRef = doc(db, 'Category', selectedCategoryId)
      const category = documents.find(doc => doc.id === selectedCategoryId)
      const currentValue = category.stats[newGoalStat] || '0'
      const newGoal = {
        name: newGoalName,
        stat: newGoalStat,
        currentValue: currentValue,
        targetValue: newGoalTarget,
        achieved: parseFloat(currentValue) >= parseFloat(newGoalTarget)
      }
      const updatedData = { 
        goals: { 
          ...category.goals,
          [newGoalName]: newGoal 
        }
      }
      updateDoc(docRef, updatedData)
        .then(() => {
          console.log("New goal added successfully")
          setShowGoalModal(false)
          setNewGoalName('')
          setNewGoalStat('')
          setNewGoalTarget('')
        })
        .catch((error) => {
          console.error("Error adding new goal: ", error)
        })
    }
  }

  // Function to handle deleting a goal
  const handleDeleteGoal = (categoryId, goalName) => {
    const db = getFirestore()
    const docRef = doc(db, 'Category', categoryId)
    const updatedData = { 
      [`goals.${goalName}`]: deleteField()
    }
    updateDoc(docRef, updatedData)
      .then(() => {
        console.log("Goal deleted successfully")
      })
      .catch((error) => {
        console.error("Error deleting goal: ", error)
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
      .then(() => {
        console.log("Goals updated successfully")
      })
      .catch((error) => {
        console.error("Error updating goals: ", error)
      })
  }

  // Function to calculate goal progress percentage
  const calculateGoalProgress = (currentValue, targetValue) => {
    const current = parseFloat(currentValue)
    const target = parseFloat(targetValue)
    if (isNaN(current) || isNaN(target) || target === 0) return 0
    return Math.min(Math.round((current / target) * 100), 100)
  }

  const handleGoalUpdate = (categoryId, goalName, field, value) => {
    const db = getFirestore()
    const docRef = doc(db, 'Category', categoryId)
    const category = documents.find(doc => doc.id === categoryId)
    const updatedGoal = { ...category.goals[goalName], [field]: value }
    
    if (field === 'targetValue') {
      updatedGoal.achieved = parseFloat(updatedGoal.currentValue) >= parseFloat(value)
    }

    const updatedData = { 
      goals: { 
        ...category.goals,
        [goalName]: updatedGoal 
      }
    }
    updateDoc(docRef, updatedData)
      .then(() => {
        console.log("Goal updated successfully")
        setEditingGoal(prevEditing => ({ ...prevEditing, [categoryId]: { ...prevEditing[categoryId], [goalName]: undefined } }))
      })
      .catch((error) => {
        console.error("Error updating goal: ", error)
      })
  }

  // New function to handle adding a category
  const handleAddCategory = () => {
    if (newCategoryName && currentUser) {
      const db = getFirestore()
      const categoryRef = collection(db, 'Category')
      addDoc(categoryRef, {
        name: newCategoryName,
        user_id: currentUser.uid,
        stats: {},
        goals: {}
      })
        .then(() => {
          console.log("New category added successfully")
          setShowNewCategoryModal(false)
          setNewCategoryName('')
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
      
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <Search className="text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow border border-gray-300 rounded-md px-3 py-2  focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="mb-4">
        <button onClick={() => setShowNewCategoryModal(true)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          + Category
        </button>
      </div>
      {filteredDocuments.length === 0 ? (
        <p>No categories found. Try adding some!</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map(doc => (
            <div key={doc.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
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
                <h3 className="text-lg font-semibold mt-4 mb-2">Stats</h3>
                <ul className="space-y-2">
                  {Object.entries(doc.stats || {}).map(([key, value]) => (
                    <li key={key} className="flex justify-between items-center">
                      <span className="font-medium">{key}:</span>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={editing[doc.id] && editing[doc.id][key] !== undefined ? editing[doc.id][key] : value}
                          onChange={(e) => handleStatChange(doc.id, key, e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e, doc.id, key)}
                          onBlur={() => handleBlur(doc.id, key)}
                          className="w-24 border border-gray-300 rounded-md px-2 py-1"
                        />
                        {editing[doc.id] && editing[doc.id][key] !== undefined && (
                          <button
                            onClick={() => handleStatUpdate(doc.id, key)}
                            className="text-green-500 hover:text-green-700"
                          >
                            <Save size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => showDeleteConfirmation(
                            () => handleDeleteStat(doc.id, key),
                            `Are you sure you want to delete the stat "${key}"?`
                          )}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleAddStat(doc.id)} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Add Stat
                </button>
                
                <h3 className="text-lg font-semibold mt-6 mb-2">Goals</h3>
                <ul className="space-y-4">
                  {Object.entries(doc.goals || {}).map(([key, goal]) => (
                    <li key={key} className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{goal.name}</span>
                        <button
                          onClick={() => showDeleteConfirmation(
                            () => handleDeleteGoal(doc.id, key),
                            `Are you sure you want to delete the goal "${key}"?`
                          )}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div>Stat: {goal.stat}</div>
                      <div>Current: {goal.currentValue}</div>
                      <div className="flex items-center space-x-2">
                        <span>Target:</span>
                        <input
                          type="text"
                          value={editingGoal[doc.id]?.[key]?.targetValue !== undefined ? editingGoal[doc.id][key].targetValue : goal.targetValue}
                          onChange={(e) => setEditingGoal(prev => ({
                            ...prev,
                            [doc.id]: { ...prev[doc.id], [key]: { ...prev[doc.id]?.[key], targetValue: e.target.value } }
                          }))}
                          onBlur={() => {
                            if (editingGoal[doc.id]?.[key]?.targetValue !== undefined) {
                              handleGoalUpdate(doc.id, key, 'targetValue', editingGoal[doc.id][key].targetValue)
                            }
                          }}
                          className="w-24 border border-gray-300 rounded-md px-2 py-1"
                        />
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{width: `${calculateGoalProgress(goal.currentValue, goal.targetValue)}%`}}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm">{calculateGoalProgress(goal.currentValue, goal.targetValue)}%</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        Status: {goal.achieved ? (
                          <span className="text-green-500 flex items-center">
                            Achieved <CheckCircle size={16} className="ml-1" />
                          </span>
                        ) : (
                          <span className="text-red-500 flex items-center">
                            Not Achieved <XCircle size={16} className="ml-1" />
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleAddGoal(doc.id)} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Add Goal
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2 className="text-xl font-bold mb-4">Add New Stat</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="statName" className="block text-sm font-medium text-gray-700 mb-1">
              Stat Name
            </label>
            <input
              id="statName"
              type="text"
              value={newStatName}
              onChange={(e) => setNewStatName(e.target.value)}
              placeholder="Enter stat name"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="statValue" className="block text-sm font-medium text-gray-700 mb-1">
              Initial Value
            </label>
            <input
              id="statValue"
              type="text"
              value={newStatValue}
              onChange={(e) => setNewStatValue(e.target.value)}
              placeholder="Enter initial value"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button onClick={handleModalSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Submit</button>
        </div>
      </Modal>

      <Modal isOpen={showGoalModal} onClose={() => setShowGoalModal(false)}>
        <h2 className="text-xl font-bold mb-4">Add New Goal</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="goalName" className="block text-sm font-medium text-gray-700 mb-1">
              Goal Name
            </label>
            <input
              id="goalName"
              type="text"
              value={newGoalName}
              onChange={(e) => setNewGoalName(e.target.value)}
              placeholder="Enter goal name"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="goalStat" className="block text-sm font-medium text-gray-700 mb-1">
              Associated Stat
            </label>
            <select
              id="goalStat"
              value={newGoalStat}
              onChange={(e) => setNewGoalStat(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a stat</option>
              {Object.keys(documents.find(doc => doc.id === selectedCategoryId)?.stats || {}).map(statName => (
                <option key={statName} value={statName}>{statName}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="goalTarget" className="block text-sm font-medium text-gray-700 mb-1">
              Target Value
            </label>
            <input
              id="goalTarget"
              type="text"
              value={newGoalTarget}
              onChange={(e) => setNewGoalTarget(e.target.value)}
              placeholder="Enter target value"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button onClick={handleGoalModalSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Submit</button>
        </div>
      </Modal>

      <Modal isOpen={showNewCategoryModal} onClose={() => setShowNewCategoryModal(false)}>
        <h2 className="text-xl font-bold mb-4">Add New Category</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              id="categoryName"
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button onClick={handleAddCategory} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Create Category</button>
        </div>
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