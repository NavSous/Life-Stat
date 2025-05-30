import React, { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../../../firebase/auth'
import { useAuth } from '../../../contexts/authContext'

const Login = () => {
    const { userLoggedIn } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSigningIn, setIsSigningIn] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const onSubmit = async (e) => {
        e.preventDefault()
        if (!isSigningIn) {
            if (!email || !password) {
                setErrorMessage('Please enter both email and password')
                return
            }
            setIsSigningIn(true)
            setErrorMessage('')
            try {
                console.log('Attempting to sign in with:', email)
                await doSignInWithEmailAndPassword(email, password)
                console.log('Sign in successful')
                // If you want to send email verification, uncomment the next line
                // await doSendEmailVerification()
            } catch (error) {
                console.error('Sign in error:', error)
                setErrorMessage(error.message)
            } finally {
                setIsSigningIn(false)
            }
        }
    }

    const onGoogleSignIn = async (e) => {
        e.preventDefault()
        if (!isSigningIn) {
            setIsSigningIn(true)
            try {
                await doSignInWithGoogle()
                console.log('Google sign in successful')
            } catch (err) {
                console.error('Google sign in error:', err)
                setErrorMessage(err.message)
            } finally {
                setIsSigningIn(false)
            }
        }
    }

    if (userLoggedIn) {
        return <Navigate to={'/home'} replace={true} />
    }

    return (
        <div>
            <main className="w-full h-screen flex self-center place-content-center place-items-center bg-gray-50">
                <div className="w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl bg-white">
                    <div className="text-center">
                        <div className="mt-2">
                            <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">Welcome to ViveStat</h3>
                        </div>
                    </div>
                    <form
                        onSubmit={onSubmit}
                        className="space-y-5"
                    >
                        <div>
                            <label className="text-sm text-gray-600 font-bold">
                                Email
                            </label>
                            <input
                                type="email"
                                autoComplete='email'
                                required
                                value={email}
                                onChange={(e) => { setEmail(e.target.value) }}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600 font-bold">
                                Password
                            </label>
                            <input
                                type="password"
                                autoComplete='current-password'
                                required
                                value={password}
                                onChange={(e) => { setPassword(e.target.value) }}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>

                        {errorMessage && (
                            <span className='text-red-600 font-bold'>{errorMessage}</span>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isSigningIn}
                                className={`w-full px-4 py-2 text-white font-medium rounded-lg ${isSigningIn ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300'}`}
                            >
                                {isSigningIn ? 'Signing In...' : 'Sign In'}
                            </button>
                            <div className="text-sm text-center mt-4">
                                Don't have an account? {'   '}
                                <Link to={'/register'} className="text-center text-sm hover:underline font-bold text-indigo-600">Sign Up</Link>
                            </div>
                        </div>
                    </form>
                    <div className='flex flex-row text-center w-full'>
                        <div className='border-b-2 mb-2.5 mr-2 w-full'></div>
                        <div className='text-sm font-bold w-fit'>OR</div>
                        <div className='border-b-2 mb-2.5 ml-2 w-full'></div>
                    </div>
                    <button
                        disabled={isSigningIn}
                        onClick={onGoogleSignIn}
                        className={`w-full flex items-center justify-center gap-x-3 py-2.5 border rounded-lg text-sm font-medium ${isSigningIn ? 'cursor-not-allowed' : 'hover:bg-gray-100 transition duration-300 active:bg-gray-100'}`}>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Continue with Google
                    </button>
                </div>
            </main>
        </div>
    )
}

export default Login