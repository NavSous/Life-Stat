import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/authContext'
import CategoryList from './data'

const Home = () => {
  const { currentUser } = useAuth()

  if (currentUser != null) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <CategoryList />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-900 mb-4">Welcome to LifeStat</h1>
          <p className="text-xl sm:text-2xl text-blue-700">Your Personal Life Tracker</p>
        </header>

        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-blue-800">Stats for Your Life Journey</h2>
            <p className="text-lg mb-6 text-gray-700">
              LifeStat is your all-in-one solution for tracking and understanding every quantitative aspect of your life. Whether you're managing finances, pursuing fitness goals, or monitoring academic progress, LifeStat helps you visualize your journey and celebrate achievements.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {['Create Customizable Stats', 'Visualize Completion of Goals', 'View Categories of Stats and Goals', 'Form Positive Habits', 'Manage Projects', 'Achieve Anything!'].map((feature, index) => (
                <div key={index} className="bg-blue-50 rounded-lg p-4 flex items-center">
                  <svg className="w-6 h-6 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-blue-800">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-blue-800">Get Started</h2>
            {currentUser ? (
              <p className="text-lg text-gray-700">
                Welcome back, <span className="font-semibold">{currentUser.email}</span>! Continue your journey of self-improvement and life tracking.
              </p>
            ) : (
              <div>
                <p className="text-lg text-gray-700 mb-6">
                  Ready to take control of your life's statistics? Sign up or log in to begin your LifeStat journey!
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a href = "/register" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                    Sign Up
                  </a>
                  <a href = "/login" className="bg-gray-200 hover:bg-gray-300 text-blue-800 font-bold py-3 px-6 rounded-lg transition duration-300">
                    Log In
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
export default Home