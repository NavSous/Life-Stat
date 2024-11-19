import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/authContext'
import { updateProfile, deleteUser, getAuth, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { auth } from '../../firebase/firebase.js'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'

const Profile = () => {
    const { currentUser, logout } = useAuth()
    const navigate = useNavigate()
    const [isEditing, setIsEditing] = useState(false)
    const [newDisplayName, setNewDisplayName] = useState(currentUser?.displayName || '')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [userStats, setUserStats] = useState({
        categories: 0,
        stats: 0,
        goals: 0,
        completedGoals: 0
    })

    useEffect(() => {
        if (currentUser) {
            fetchUserStats()
        }
    }, [currentUser])

    if (!currentUser) {
        navigate('/')
        return null
    }

    const fetchUserStats = async () => {
        const db = getFirestore()
        const categoriesRef = collection(db, 'Category')
        const q = query(categoriesRef, where("user_id", "==", currentUser.uid))
        
        try {
            const querySnapshot = await getDocs(q)
            let totalStats = 0
            let totalGoals = 0
            let completedGoals = 0

            querySnapshot.forEach((doc) => {
                const category = doc.data()
                totalStats += Object.keys(category.stats || {}).length
                totalGoals += Object.keys(category.goals || {}).length
                completedGoals += Object.values(category.goals || {}).filter(goal => goal.achieved).length
            })

            setUserStats({
                categories: querySnapshot.size,
                stats: totalStats,
                goals: totalGoals,
                completedGoals: completedGoals
            })
        } catch (error) {
            console.error("Error fetching user stats: ", error)
        }
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        setError('')
        setMessage('')
        try {
            await updateProfile(auth.currentUser, { displayName: newDisplayName })
            setMessage('Profile updated successfully!')
            setIsEditing(false)
            window.location.reload();
        } catch (error) {
            setError('Failed to update profile. ' + error.message)
        }
    }

    const handleDeleteAccount = async () => {
        setError('');
        setMessage('');
        try {
            if (password.toLowerCase() !== 'delete') {
                setError('Please type "delete" to confirm account deletion.');
                setShowDeleteModal(false);
                return;         
            }
    
            const auth = getAuth();
            const user = auth.currentUser;
    
            if (!user) {
                throw new Error("No user is currently logged in.");
            }
    
            await deleteUser(user);
            await logout();
            navigate('/');
        } catch (error) {
            setError('Failed to delete account. ' + error.message);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg mt-20 mb-8">
                <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">User Profile</div>
                    {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                    {message && <p className="text-green-500 text-xs italic mb-4">{message}</p>}
                    <div className="mb-4">
                        <p className="text-gray-700 text-base">
                            <span className="font-semibold">Name:</span> {currentUser.displayName}
                        </p>
                    </div>
                    <div className="mb-4">
                        <p className="text-gray-700 text-base">
                            <span className="font-semibold">Email:</span> {currentUser.email}
                        </p>
                    </div>
                    <div className="mb-4">
                        <p className="text-gray-700 text-base">
                            <span className="font-semibold">ID:</span> {currentUser.uid}
                        </p>
                    </div>
                </div>
                {isEditing ? (
                    <form onSubmit={handleUpdateProfile} className="px-6 py-4 border-t">
                        <div className="mb-4">
                            <label htmlFor="displayName" className="block text-gray-700 text-sm font-bold mb-2">
                                New Display Name:
                            </label>
                            <input
                                type="text"
                                id="displayName"
                                value={newDisplayName}
                                onChange={(e) => setNewDisplayName(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="px-6 py-4 border-t">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                        >
                            Edit Profile
                        </button>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Delete Account
                        </button>
                    </div>
                )}
            </div>

            {/* New Statistics Box */}
            <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">Your LifeStat Summary</div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-700 text-base">
                                <span className="font-semibold">Categories:</span> {userStats.categories}
                            </p>
                            <p className="text-gray-700 text-base">
                                <span className="font-semibold">Stats:</span> {userStats.stats}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-700 text-base">
                                <span className="font-semibold">Goals:</span> {userStats.goals}
                            </p>
                            <p className="text-gray-700 text-base">
                                <span className="font-semibold">Completed Goals:</span> {userStats.completedGoals}
                            </p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-gray-700 text-base">
                            <span className="font-semibold">Goal Completion Percentage:</span> 
                            {userStats.goals > 0 
                                ? ` ${Math.round((userStats.completedGoals / userStats.goals) * 100)}%`
                                : ' N/A'}
                        </p>
                        {userStats.goals > 0 && (
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                <div 
                                    className="bg-blue-600 h-2.5 rounded-full" 
                                    style={{width: `${(userStats.completedGoals / userStats.goals) * 100}%`}}
                                ></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="deleteAccountModal">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Account</h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500">
                                    Please type the word: "Delete" to confirm your account deletion
                                </p>
                                <input
                                    type="text"
                                    className="mt-2 px-3 py-2 border shadow-sm border-gray-300 rounded-md w-full"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter the word"
                                />
                            </div>
                            <div className="items-center px-4 py-3">
                                <button
                                    onClick={handleDeleteAccount}
                                    className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                                >
                                    Delete Account
                                </button>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="mt-3 px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Profile
/*
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/authContext'
import { updateProfile, deleteUser, getAuth, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { auth } from '../../firebase/firebase.js' // Make sure this path is correct


const Profile = () => {
    const { currentUser, logout } = useAuth()
    const navigate = useNavigate()
    const [isEditing, setIsEditing] = useState(false)
    const [newDisplayName, setNewDisplayName] = useState(currentUser?.displayName || '')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    if (!currentUser) {
        navigate('/')
        return null
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        setError('')
        setMessage('')
        try {
            await updateProfile(auth.currentUser, { displayName: newDisplayName })
            setMessage('Profile updated successfully!')
            setIsEditing(false)
            window.location.reload();
        } catch (error) {
            setError('Failed to update profile. ' + error.message)
        }
    }

    const handleDeleteAccount = async () => {
        setError('');
        setMessage('');
        try {
            if (password.toLowerCase() !== 'delete') {
                setError('Please type "delete" to confirm account deletion.');
                setShowDeleteModal(false);
                return;         
            }
    
            const auth = getAuth();
            const user = auth.currentUser;
    
            if (!user) {
                throw new Error("No user is currently logged in.");
            }
    
            await deleteUser(user);
            await logout();
            navigate('/');
        } catch (error) {
            setError('Failed to delete account. ' + error.message);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg mt-20">
                <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">User Profile</div>
                    {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                    {message && <p className="text-green-500 text-xs italic mb-4">{message}</p>}
                    <div className="mb-4">
                        <p className="text-gray-700 text-base">
                            <span className="font-semibold">Name:</span> {currentUser.displayName}
                        </p>
                    </div>
                    <div className="mb-4">
                        <p className="text-gray-700 text-base">
                            <span className="font-semibold">Email:</span> {currentUser.email}
                        </p>
                    </div>
                    <div className="mb-4">
                        <p className="text-gray-700 text-base">
                            <span className="font-semibold">ID:</span> {currentUser.uid}
                        </p>
                    </div>
                </div>
                {isEditing ? (
                    <form onSubmit={handleUpdateProfile} className="px-6 py-4 border-t">
                        <div className="mb-4">
                            <label htmlFor="displayName" className="block text-gray-700 text-sm font-bold mb-2">
                                New Display Name:
                            </label>
                            <input
                                type="text"
                                id="displayName"
                                value={newDisplayName}
                                onChange={(e) => setNewDisplayName(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="px-6 py-4 border-t">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                        >
                            Edit Profile
                        </button>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Delete Account
                        </button>
                    </div>
                )}
            </div>

           
            {showDeleteModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="deleteAccountModal">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Account</h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500">
                                    Please type the word: "Delete" to confirm your account deletion
                                </p>
                                <input
                                    type="text"
                                    className="mt-2 px-3 py-2 border shadow-sm border-gray-300 rounded-md w-full"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                />
                            </div>
                            <div className="items-center px-4 py-3">
                                <button
                                    onClick={handleDeleteAccount}
                                    className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                                >
                                    Delete Account
                                </button>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="mt-3 px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Profile
*/