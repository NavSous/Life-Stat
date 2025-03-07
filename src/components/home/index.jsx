"use client"
import { useAuth } from "../../contexts/authContext"
import CategoryList from "./data"
import { motion } from "framer-motion"
import { ArrowRight, BarChart2, Target, Calendar, Zap, CheckCircle } from "lucide-react"
import { useState } from "react"

const Home = () => {
  const { currentUser } = useAuth()

  if (currentUser != null) {
    return (
      <div className="container mx-auto px-4 py-8">
        <CategoryList />
      </div>
    )
  }

  const features = [
    { icon: BarChart2, text: "Create Customizable Stats" },
    { icon: Target, text: "Visualize Goal Completion" },
    { icon: Calendar, text: "Track Categories of Stats" },
    { icon: Zap, text: "Form Positive Habits" },
    { icon: CheckCircle, text: "Manage Projects" },
    { icon: ArrowRight, text: "Achieve Anything!" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
        <motion.header
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-indigo-900 mb-4">Welcome to LifeStat</h1>
          <p className="text-xl sm:text-2xl text-indigo-700">Your Personal Life Tracker</p>
        </motion.header>

        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-80 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-indigo-800">Stats for Your Life Journey</h2>
            <p className="text-lg mb-8 text-gray-700 leading-relaxed">
              LifeStat is your all-in-one solution for tracking and understanding every quantitative aspect of your
              life. Visualize your journey, celebrate achievements, and unlock your full potential.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-indigo-50 rounded-lg p-4 flex items-center transition-all hover:shadow-md hover:bg-indigo-100"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <feature.icon className="w-6 h-6 text-indigo-500 mr-3" />
                  <span className="text-indigo-800">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
        <div className="flex flex-col items-center mb-8">
  <h2 className="text-lg font-semibold mb-2 text-gray-700">LifeStat in Action!</h2>
  <div className="flex justify-center">
    <img 
      src="demo.png" 
      alt="LifeStat Preview" 
      className="rounded-2xl shadow-lg w-auto h-[700px] drop-shadow-[0_0_20px_rgba(173,216,230,0.6)]"
    />
  </div>
</div>
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center backdrop-blur-sm bg-opacity-80">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-indigo-800">Get Started</h2>
            {currentUser ? (
              <p className="text-lg text-gray-700">
                Welcome back, <span className="font-semibold">{currentUser.email}</span>! Continue your journey of
                self-improvement and life tracking.
              </p>
            ) : (
              <div>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  Ready to take control of your life's statistics? Sign up or log in to begin your LifeStat journey and
                  unlock your full potential!
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <motion.a
                    href="/register"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 inline-flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign Up
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </motion.a>
                  <motion.a
                    href="/login"
                    className="bg-purple-100 hover:bg-purple-200 text-indigo-800 font-bold py-3 px-6 rounded-lg transition duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Log In
                  </motion.a>
                </div>
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default Home
