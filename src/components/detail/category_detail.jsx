"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { getFirestore, doc, getDoc, updateDoc, deleteField } from "firebase/firestore"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { ArrowLeft, CheckCircle, XCircle, PlusCircle, Trash2 } from "lucide-react"

// Modal component (same as in CategoryList)
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white p-6 sm:p-8 rounded-xl max-w-md w-full shadow-2xl transform transition-all animate-slideIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mb-6">
          {children}
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="modalForm"
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

// ConfirmDialog component (same as in CategoryList)
const ConfirmDialog = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white p-6 sm:p-8 rounded-xl max-w-md w-full shadow-2xl transform transition-all animate-slideIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Confirm Action</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// Form components (same as in CategoryList)
const StatForm = ({ onSubmit }) => {
  const [name, setName] = useState("")
  const [value, setValue] = useState("")
  return (
    <form
      id="modalForm"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({ name, value })
      }}
    >
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
  const [name, setName] = useState("")
  const [stat, setStat] = useState("")
  const [target, setTarget] = useState("")
  const [isQualitative, setIsQualitative] = useState(false)

  return (
    <form
      id="modalForm"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({ name, stat, target, isQualitative })
      }}
      className="space-y-4"
    >
      <div>
        <label htmlFor="goalName" className="block text-sm font-medium text-gray-700 mb-1">
          Goal Name
        </label>
        <input
          id="goalName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter goal name"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
        />
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isQualitative"
          checked={isQualitative}
          onChange={(e) => setIsQualitative(e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="isQualitative" className="text-sm font-medium text-gray-700">
          This is a task-based goal (can be marked as complete/incomplete)
        </label>
      </div>
      {!isQualitative && (
        <>
          <div>
            <label htmlFor="goalStat" className="block text-sm font-medium text-gray-700 mb-1">
              Associated Stat
            </label>
            <select
              id="goalStat"
              value={stat}
              onChange={(e) => setStat(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
            >
              <option value="">Select a stat</option>
              {Object.keys(stats).map((statName) => (
                <option key={statName} value={statName}>
                  {statName}
                </option>
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
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="Enter target value"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>
        </>
      )}
    </form>
  )
}

// Helper function to handle comma-separated numbers
const parseNumericValue = (value) => {
  if (typeof value !== 'string') return value;
  return value.replace(/,/g, '');
};

function CategoryDetail() {
  const { categoryId } = useParams()
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  // State for editing functionality (same as in CategoryList)
  const [editing, setEditing] = useState({})
  const [modalState, setModalState] = useState({ isOpen: false, type: null, data: {} })
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, message: "", onConfirm: null })
  const [hideCompletedGoals, setHideCompletedGoals] = useState(false)

  // Effect hook to handle authentication
  useEffect(() => {
    const auth = getAuth()
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      if (user) {
        fetchCategoryDetails(categoryId)
      } else {
        setLoading(false)
        setError("Please log in to view category details.")
      }
    })
    return () => unsubscribeAuth()
  }, [categoryId])

  // Function to fetch category details from Firestore
  const fetchCategoryDetails = async (id) => {
    try {
      setLoading(true)
      const db = getFirestore()
      const docRef = doc(db, "Category", id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data()

        // Create proper statsOrder and goalsOrder if they don't exist
        const statsOrder = data.statsOrder || []
        const goalsOrder = data.goalsOrder || []

        // Make sure all stats are in the statsOrder array
        const allStats = Object.keys(data.stats || {})
        const missingStats = allStats.filter((stat) => !statsOrder.includes(stat))
        const completeStatsOrder = [...statsOrder, ...missingStats]

        // Make sure all goals are in the goalsOrder array
        const allGoals = Object.keys(data.goals || {})
        const missingGoals = allGoals.filter((goal) => !goalsOrder.includes(goal))
        const completeGoalsOrder = [...goalsOrder, ...missingGoals]

        setCategory({
          id: docSnap.id,
          ...data,
          statsOrder: completeStatsOrder,
          goalsOrder: completeGoalsOrder,
        })
      } else {
        setError("Category not found")
      }
    } catch (err) {
      console.error("Error fetching category details: ", err)
      setError("Failed to fetch category details. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  // Function to calculate goal progress percentage
  const calculateGoalProgress = (currentValue, targetValue) => {
    const current = Number.parseFloat(parseNumericValue(currentValue))
    const target = Number.parseFloat(parseNumericValue(targetValue))
    if (isNaN(current) || isNaN(target) || target === 0) return 0
    return Math.min(Math.round((current / target) * 100), 100)
  }

  // Function to handle adding or updating a stat or goal (same as in CategoryList)
  const handleAddOrUpdate = (type, data) => {
    const db = getFirestore()
    const docRef = doc(db, "Category", categoryId)
    let updatedData = {}

    if (type === "stat") {
      // Check if the stat already exists (updating) or is new (adding)
      const isNewStat = !(data.name in (category.stats || {}))

      updatedData = {
        stats: {
          ...(category.stats || {}),
          [data.name]: data.value,
        },
      }

      // Add to statsOrder if it's a new stat
      if (isNewStat) {
        updatedData.statsOrder = [...(category.statsOrder || []), data.name]
      }
    } else if (type === "goal") {
      const currentValue = data.isQualitative ? false : ((category.stats || {})[data.stat] || "0")
      const newGoal = {
        name: data.name,
        isQualitative: data.isQualitative,
        stat: data.isQualitative ? null : data.stat,
        currentValue: currentValue,
        targetValue: data.isQualitative ? null : data.target,
        achieved: data.isQualitative ? false : (Number.parseFloat(parseNumericValue(currentValue)) >= Number.parseFloat(parseNumericValue(data.target))),
      }
      updatedData = {
        goals: {
          ...(category.goals || {}),
          [data.name]: newGoal,
        },
      }

      // Add to goalsOrder if it doesn't exist
      if (!category.goalsOrder.includes(data.name)) {
        updatedData.goalsOrder = [...(category.goalsOrder || []), data.name]
      }
    }

    updateDoc(docRef, updatedData)
      .then(() => {
        console.log(`${type} added/updated successfully`)
        setModalState({ isOpen: false, type: null, data: {} })
        // Refresh category data
        fetchCategoryDetails(categoryId)
      })
      .catch((error) => {
        console.error(`Error adding/updating ${type}: `, error)
      })
  }

  // Function to handle deleting a stat or goal (same as in CategoryList)
  const handleDelete = (type, itemName) => {
    const db = getFirestore()
    const docRef = doc(db, "Category", categoryId)
    const updatedData = {
      [`${type}s.${itemName}`]: deleteField(),
    }

    // Remove from order array
    if (type === "stat" && category.statsOrder) {
      updatedData.statsOrder = category.statsOrder.filter((name) => name !== itemName)
    } else if (type === "goal" && category.goalsOrder) {
      updatedData.goalsOrder = category.goalsOrder.filter((name) => name !== itemName)
    }

    updateDoc(docRef, updatedData)
      .then(() => {
        console.log(`${type} deleted successfully`)
        // Refresh category data
        fetchCategoryDetails(categoryId)
      })
      .catch((error) => {
        console.error(`Error deleting ${type}: `, error)
      })
  }

  // Function to show confirmation dialog (same as in CategoryList)
  const showDeleteConfirmation = (type, itemName) => {
    setConfirmDialog({
      isOpen: true,
      message: `Are you sure you want to delete this ${type}?`,
      onConfirm: () => {
        handleDelete(type, itemName)
        setConfirmDialog({ isOpen: false, message: "", onConfirm: null })
      },
    })
  }

  // Update the handleStatChange function (same as in CategoryList)
  const handleStatChange = (statKey, newValue, field = "value") => {
    setEditing((prev) => ({
      ...prev,
      [statKey]: {
        ...(prev[statKey] || {}),
        [field]: newValue,
      },
    }))
  }

  // Update the handleStatUpdate function (same as in CategoryList)
  const handleStatUpdate = (statKey) => {
    const db = getFirestore()
    const docRef = doc(db, "Category", categoryId)

    // Check if we're updating the name
    if (editing[statKey]?.name && editing[statKey].name !== statKey) {
      // Create a new stats object with the updated name
      const newStats = { ...(category.stats || {}) }
      const oldValue = newStats[statKey]
      delete newStats[statKey]
      newStats[editing[statKey].name] = editing[statKey].value || oldValue

      // Update goals that reference this stat
      const updatedGoals = { ...(category.goals || {}) }
      Object.entries(category.goals || {}).forEach(([goalName, goal]) => {
        if (goal.stat === statKey) {
          updatedGoals[goalName] = {
            ...goal,
            stat: editing[statKey].name,
          }
        }
      })

      // Update the statsOrder array to maintain order
      const updatedStatsOrder = [...(category.statsOrder || [])]
      const statIndex = updatedStatsOrder.indexOf(statKey)
      if (statIndex !== -1) {
        updatedStatsOrder[statIndex] = editing[statKey].name
      } else {
        // If for some reason the stat isn't in the order array, add it
        updatedStatsOrder.push(editing[statKey].name)
      }

      updateDoc(docRef, {
        stats: newStats,
        goals: updatedGoals,
        statsOrder: updatedStatsOrder,
      })
        .then(() => {
          console.log("Stat renamed successfully")
          setEditing((prev) => {
            const newEditing = { ...prev }
            delete newEditing[statKey]
            return newEditing
          })
          // Refresh category data
          fetchCategoryDetails(categoryId)
        })
        .catch((error) => {
          console.error("Error renaming stat: ", error)
        })
    }
    // If we're just updating the value
    else if (editing[statKey]?.value) {
      const updatedData = {
        stats: {
          ...(category.stats || {}),
          [statKey]: editing[statKey].value,
        },
      }
      updateDoc(docRef, updatedData)
        .then(() => {
          console.log("Stat value updated successfully")
          setEditing((prev) => {
            const newEditing = { ...prev }
            delete newEditing[statKey]
            return newEditing
          })
          // Update goals that use this stat
          updateGoalsForStat(statKey, editing[statKey].value)
        })
        .catch((error) => {
          console.error("Error updating stat value: ", error)
        })
    }
  }

  // Function to update goals when associated stat changes
  const updateGoalsForStat = (statKey, newValue) => {
    const db = getFirestore()
    const docRef = doc(db, "Category", categoryId)
    const updatedGoals = { ...(category.goals || {}) }

    Object.entries(category.goals || {}).forEach(([goalName, goal]) => {
      if (goal.stat === statKey) {
        updatedGoals[goalName] = {
          ...goal,
          currentValue: newValue,
          achieved: Number.parseFloat(parseNumericValue(newValue)) >= Number.parseFloat(parseNumericValue(goal.targetValue)),
        }
      }
    })

    updateDoc(docRef, { goals: updatedGoals })
      .then(() => {
        console.log("Goals updated successfully")
        // Refresh category data
        fetchCategoryDetails(categoryId)
      })
      .catch((error) => {
        console.error("Error updating goals: ", error)
      })
  }

  // Add functions to handle goal editing (same as in CategoryList)
  const handleGoalChange = (goalKey, field, newValue) => {
    setEditing((prev) => ({
      ...prev,
      goals: {
        ...(prev.goals || {}),
        [goalKey]: {
          ...(prev.goals?.[goalKey] || {}),
          [field]: newValue,
        },
      },
    }))
  }

  const handleGoalUpdate = (goalKey) => {
    const db = getFirestore()
    const docRef = doc(db, "Category", categoryId)
    const goalEdits = editing.goals?.[goalKey]

    if (!goalEdits) return

    // Create a copy of the goals object
    const updatedGoals = { ...(category.goals || {}) }

    // If the name is being changed
    if (goalEdits.name && goalEdits.name !== goalKey && goalEdits.name.trim() !== "") {
      // Create a new goal with the updated name
      const updatedGoal = { ...updatedGoals[goalKey] }

      // Apply any other edits to the goal
      if (goalEdits.target) {
        updatedGoal.targetValue = goalEdits.target
        updatedGoal.achieved = Number.parseFloat(parseNumericValue(updatedGoal.currentValue)) >= Number.parseFloat(parseNumericValue(goalEdits.target))
      }

      if (goalEdits.stat) {
        updatedGoal.stat = goalEdits.stat
        updatedGoal.currentValue = (category.stats || {})[goalEdits.stat] || "0"
        updatedGoal.achieved = Number.parseFloat(parseNumericValue(updatedGoal.currentValue)) >= Number.parseFloat(parseNumericValue(updatedGoal.targetValue))
      }

      // Update the name property
      updatedGoal.name = goalEdits.name

      // Remove the old goal and add the new one
      delete updatedGoals[goalKey]
      updatedGoals[goalEdits.name] = updatedGoal

      // Update the goalsOrder array to maintain order
      const updatedGoalsOrder = [...(category.goalsOrder || [])]
      const goalIndex = updatedGoalsOrder.indexOf(goalKey)
      if (goalIndex !== -1) {
        updatedGoalsOrder[goalIndex] = goalEdits.name
      }

      // Update the entire goals object in Firestore
      updateDoc(docRef, {
        goals: updatedGoals,
        goalsOrder: updatedGoalsOrder,
      })
        .then(() => {
          console.log("Goal renamed successfully:", goalEdits.name)
          setEditing((prev) => {
            const newEditing = { ...prev }
            if (newEditing.goals) {
              delete newEditing.goals[goalKey]
            }
            return newEditing
          })
          // Refresh category data
          fetchCategoryDetails(categoryId)
        })
        .catch((error) => {
          console.error("Error renaming goal:", error)
        })
    }
    // If we're just updating target or stat
    else {
      const updatedGoal = { ...updatedGoals[goalKey] }
      let hasChanges = false

      if (goalEdits.target) {
        updatedGoal.targetValue = goalEdits.target
        updatedGoal.achieved = Number.parseFloat(parseNumericValue(updatedGoal.currentValue)) >= Number.parseFloat(parseNumericValue(goalEdits.target))
        hasChanges = true
      }

      if (goalEdits.stat) {
        updatedGoal.stat = goalEdits.stat
        updatedGoal.currentValue = (category.stats || {})[goalEdits.stat] || "0"
        updatedGoal.achieved = Number.parseFloat(parseNumericValue(updatedGoal.currentValue)) >= Number.parseFloat(parseNumericValue(updatedGoal.targetValue))
        hasChanges = true
      }

      if (hasChanges) {
        updatedGoals[goalKey] = updatedGoal

        updateDoc(docRef, { goals: updatedGoals })
          .then(() => {
            console.log("Goal updated successfully")
            setEditing((prev) => {
              const newEditing = { ...prev }
              if (newEditing.goals) {
                delete newEditing.goals[goalKey]
              }
              return newEditing
            })
            // Refresh category data
            fetchCategoryDetails(categoryId)
          })
          .catch((error) => {
            console.error("Error updating goal:", error)
          })
      }
    }
  }

  // Add handleQualitativeGoalToggle function after handleGoalUpdate
  const handleQualitativeGoalToggle = (goalKey, currentAchieved) => {
    const db = getFirestore()
    const docRef = doc(db, "Category", categoryId)
    const updatedGoals = { ...(category.goals || {}) }
    
    updatedGoals[goalKey] = {
      ...updatedGoals[goalKey],
      achieved: !currentAchieved,
      currentValue: !currentAchieved
    }

    updateDoc(docRef, { goals: updatedGoals })
      .then(() => {
        console.log("Goal toggle updated successfully")
        // Refresh category data
        fetchCategoryDetails(categoryId)
      })
      .catch((error) => {
        console.error("Error toggling goal:", error)
      })
  }

  // Render loading state
  if (loading) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 mt-16">
        <div className="text-center p-4">Loading category details...</div>
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 mt-16">
        <div className="text-center p-4 text-red-500">{error}</div>
        <div className="text-center mt-4">
          <Link to="/" className="text-blue-500 hover:text-blue-700">
            Back to Categories
          </Link>
        </div>
      </div>
    )
  }

  // Render login prompt if no user is authenticated
  if (!currentUser) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 mt-16">
        <div className="text-center p-4">Please log in to view category details.</div>
      </div>
    )
  }

  // Render if category is not found
  if (!category) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 mt-16">
        <div className="text-center p-4">Category not found</div>
        <div className="text-center mt-4">
          <Link to="/" className="text-blue-500 hover:text-blue-700">
            Back to Categories
          </Link>
        </div>
      </div>
    )
  }

  // Update the main return statement to be more mobile-friendly
  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 mt-16">
      <div className="mb-4 sm:mb-6">
        <Link to="/" className="inline-flex items-center text-blue-500 hover:text-blue-700 py-2">
          <ArrowLeft className="mr-2" size={16} />
          Back to Categories
        </Link>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">{category.name}</h1>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Stats Section */}
            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-700 border-b pb-2 w-full sm:w-auto">Stats</h2>
                <button
                  onClick={() => setModalState({ isOpen: true, type: "stat", data: {} })}
                  className="text-blue-500 hover:text-blue-600 font-medium flex items-center py-1"
                >
                  <PlusCircle size={16} className="mr-1" /> Add Stat
                </button>
              </div>

              {category.statsOrder && category.statsOrder.length > 0 ? (
                <div className="space-y-4">
                  {category.statsOrder.map((statName) => (
                    <div
                      key={statName}
                      className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center p-3 bg-gray-50 rounded-md gap-2"
                    >
                      <input
                        type="text"
                        value={editing[statName]?.name ?? statName}
                        onChange={(e) => handleStatChange(statName, e.target.value, "name")}
                        onBlur={() => handleStatUpdate(statName)}
                        className="font-medium text-gray-600 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent w-full sm:w-auto"
                      />
                      <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-start">
                        <input
                          type="text"
                          value={editing[statName]?.value ?? category.stats[statName]}
                          onChange={(e) => handleStatChange(statName, e.target.value, "value")}
                          onBlur={() => handleStatUpdate(statName)}
                          className="w-24 border border-gray-300 rounded-md px-2 py-1 text-right"
                        />
                        <button
                          onClick={() => showDeleteConfirmation("stat", statName)}
                          className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No stats available</p>
              )}
            </div>

            {/* Goals Section */}
            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-700 border-b pb-2 w-full sm:w-auto">Goals</h2>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  <button
                    onClick={() => setHideCompletedGoals(!hideCompletedGoals)}
                    className="text-gray-600 hover:text-gray-800 font-medium text-sm py-1"
                  >
                    {hideCompletedGoals ? "Show Completed" : "Hide Completed"}
                  </button>
                  <button
                    onClick={() => setModalState({ isOpen: true, type: "goal", data: {} })}
                    className="text-blue-500 hover:text-blue-600 font-medium flex items-center py-1"
                  >
                    <PlusCircle size={16} className="mr-1" /> Add Goal
                  </button>
                </div>
              </div>

              {category.goalsOrder && category.goalsOrder.length > 0 ? (
                <div className="space-y-6">
                  {category.goalsOrder
                    .filter((goalName) => {
                      const goal = category.goals[goalName]
                      return !hideCompletedGoals || !goal.achieved
                    })
                    .map((goalName) => {
                      const goal = category.goals[goalName]
                      if (!goal) return null

                      return (
                        <div key={goalName} className="border rounded-lg p-3 sm:p-4 bg-gray-50">
                          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-2 gap-2">
                            <input
                              type="text"
                              value={editing.goals?.[goalName]?.name ?? goal.name}
                              onChange={(e) => handleGoalChange(goalName, "name", e.target.value)}
                              onBlur={() => handleGoalUpdate(goalName)}
                              className="font-medium text-gray-700 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent w-full sm:w-auto"
                            />
                            <button
                              onClick={() => showDeleteConfirmation("goal", goalName)}
                              className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          {goal.isQualitative ? (
                            <div className="flex items-center space-x-2 mt-2">
                              <button
                                onClick={() => handleQualitativeGoalToggle(goalName, goal.achieved)}
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
                                  goal.achieved
                                    ? "bg-green-500 border-green-500"
                                    : "bg-white border-gray-300 hover:border-gray-400"
                                }`}
                              >
                                {goal.achieved && (
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </button>
                              <span className="text-sm text-gray-600">Mark as complete</span>
                            </div>
                          ) : (
                            <>
                              <div className="text-sm text-gray-600 flex flex-wrap items-center mb-1 gap-1">
                                <span className="mr-1">Stat:</span>
                                <select
                                  value={editing.goals?.[goalName]?.stat ?? goal.stat}
                                  onChange={(e) => handleGoalChange(goalName, "stat", e.target.value)}
                                  onBlur={() => handleGoalUpdate(goalName)}
                                  className="border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent flex-grow sm:flex-grow-0"
                                >
                                  {Object.keys(category.stats || {}).map((statName) => (
                                    <option key={statName} value={statName}>
                                      {statName}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="text-sm text-gray-600 mb-1">
                                Current: <span className="font-medium">{goal.currentValue}</span>
                              </div>

                              <div className="text-sm text-gray-600 flex flex-wrap items-center mb-3 gap-1">
                                <span className="mr-1">Target:</span>
                                <input
                                  type="text"
                                  value={editing.goals?.[goalName]?.target ?? goal.targetValue}
                                  onChange={(e) => handleGoalChange(goalName, "target", e.target.value)}
                                  onBlur={() => handleGoalUpdate(goalName)}
                                  className="w-20 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
                                />
                              </div>

                              <div className="mt-2">
                                <div className="flex items-center">
                                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                                      style={{ width: `${calculateGoalProgress(goal.currentValue, goal.targetValue)}%` }}
                                    ></div>
                                  </div>
                                  <span className="ml-2 text-sm text-gray-600 whitespace-nowrap">
                                    {calculateGoalProgress(goal.currentValue, goal.targetValue)}%
                                  </span>
                                </div>
                              </div>
                            </>
                          )}

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
                        </div>
                      )
                    })}
                </div>
              ) : (
                <p className="text-gray-500 italic">No goals available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for adding stats and goals */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, type: null, data: {} })}
        title={`Add New ${modalState.type === "stat" ? "Stat" : "Goal"}`}
      >
        {modalState.type === "stat" && <StatForm onSubmit={(data) => handleAddOrUpdate("stat", data)} />}
        {modalState.type === "goal" && (
          <GoalForm onSubmit={(data) => handleAddOrUpdate("goal", data)} stats={category?.stats || {}} />
        )}
      </Modal>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, message: "", onConfirm: null })}
        onConfirm={confirmDialog.onConfirm}
        message={confirmDialog.message}
      />
    </div>
  )
}

export default CategoryDetail

