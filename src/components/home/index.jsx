"use client"
import { useAuth } from "../../contexts/authContext"
import CategoryList from "./data"
import { motion } from "framer-motion"
import { ArrowRight, BarChart2, Target, Calendar, Zap, CheckCircle } from "lucide-react"
import { useState } from "react"

// Helper function to handle comma-separated numbers (same as in main app)
const parseNumericValue = (value) => {
  if (typeof value !== 'string') return value;
  return value.replace(/,/g, '');
};

// Demo components
const DemoCategory = ({ name, stats: initialStats, goals: initialGoals }) => {
  const [hideCompletedGoals, setHideCompletedGoals] = useState(false)
  const [stats, setStats] = useState(initialStats)
  const [goals, setGoals] = useState(initialGoals)

  const handleQualitativeGoalToggle = (goalIndex) => {
    setGoals(prevGoals => {
      const newGoals = [...prevGoals]
      newGoals[goalIndex] = {
        ...newGoals[goalIndex],
        achieved: !newGoals[goalIndex].achieved
      }
      return newGoals
    })
  }

  const handleStatUpdate = (statIndex, newValue) => {
    const statName = stats[statIndex].name
    
    setStats(prevStats => {
      const newStats = [...prevStats]
      newStats[statIndex] = {
        ...newStats[statIndex],
        value: newValue
      }
      return newStats
    })

    // Update related goals
    setGoals(prevGoals => {
      return prevGoals.map(goal => {
        if (!goal.isQualitative && goal.stat === statName) {
          const currentValue = parseNumericValue(newValue)
          const targetValue = parseNumericValue(goal.targetValue)
          const current = Number.parseFloat(currentValue)
          const target = Number.parseFloat(targetValue)
          
          // Calculate progress percentage (same as main app)
          let progress = 0
          if (!isNaN(current) && !isNaN(target) && target !== 0) {
            progress = Math.min(Math.round((current / target) * 100), 100)
          }

          return {
            ...goal,
            currentValue: newValue,
            progress,
            achieved: current >= target
          }
        }
        return goal
      })
    })
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
        </div>

        {/* Stats Section */}
        <div className="mb-4">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Stats</h4>
          <div className="space-y-2">
            {stats.map((stat, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-medium text-gray-600">{stat.name}</span>
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => handleStatUpdate(index, e.target.value)}
                  className="w-24 border border-gray-300 rounded-md px-2 py-1 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Goals Section */}
        <div>
          <h4 className="text-lg font-medium text-gray-700 mb-2">Goals</h4>
          <div className="space-y-3">
            {goals
              .filter(goal => !hideCompletedGoals || !goal.achieved)
              .map((goal, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="border rounded-lg p-3 bg-gray-50"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">{goal.name}</span>
                    {goal.isQualitative ? (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleQualitativeGoalToggle(index)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
                          goal.achieved
                            ? "bg-green-500 border-green-500"
                            : "bg-white border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {goal.achieved && (
                          <motion.svg
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </motion.svg>
                        )}
                      </motion.button>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${goal.progress}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="bg-blue-600 h-2 rounded-full"
                          />
                        </div>
                        <span className="text-sm text-gray-600">{goal.progress}%</span>
                      </div>
                    )}
                  </div>
                  {!goal.isQualitative && (
                    <div className="text-sm text-gray-600">
                      Current: {goal.currentValue} / Target: {goal.targetValue}
                    </div>
                  )}
                  {goal.achieved && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-green-500 text-sm flex items-center"
                    >
                      <CheckCircle size={16} className="mr-1" />
                      Achieved!
                    </motion.div>
                  )}
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

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
    { 
      icon: BarChart2, 
      text: "Create Customizable Stats",
      description: "Track any metric that matters to you"
    },
    { 
      icon: Target, 
      text: "Visualize Goal Completion",
      description: "See your progress in real-time"
    },
    { 
      icon: Calendar, 
      text: "Track Categories of Stats",
      description: "Organize your life's metrics"
    },
    { 
      icon: Zap, 
      text: "Form Positive Habits",
      description: "Build lasting routines"
    },
    { 
      icon: CheckCircle, 
      text: "Manage Projects",
      description: "Track tasks and milestones"
    },
    { 
      icon: ArrowRight, 
      text: "Achieve Anything!",
      description: "Turn goals into reality"
    },
  ]

  // Demo data
  const demoCategories = [
    {
      name: "Fitness Goals",
      stats: [
        { name: "Daily Steps", value: "8,500" },
        { name: "Weight", value: "70 kg" },
      ],
      goals: [
        {
          name: "Complete 4 Weekly Workouts",
          isQualitative: true,
          achieved: false,
        },
        {
          name: "Reach 10,000 Daily Steps",
          isQualitative: false,
          stat: "Daily Steps",
          currentValue: "8,500",
          targetValue: "10,000",
          progress: 85,
          achieved: false,
        },
        {
          name: "Gain 5kg",
          isQualitative: false,
          stat: "Weight",
          currentValue: "70 kg",
          targetValue: "75 kg",
          progress: 93,
          achieved: false,
        },
      ],
    },
    {
      name: "Reading Habits",
      stats: [
        { name: "Books Read", value: "12" },
        { name: "Pages Today", value: "45" },
        { name: "Reading Streak", value: "7 days" },
      ],
      goals: [
        {
          name: "Read 20 Pages Daily",
          isQualitative: false,
          stat: "Pages Today",
          currentValue: "45",
          targetValue: "20",
          progress: 100,
          achieved: true,
        },
        {
          name: "Complete Current Book",
          isQualitative: true,
          achieved: false,
        },
        {
          name: "Maintain 30-day Streak",
          isQualitative: false,
          stat: "Reading Streak",
          currentValue: "7",
          targetValue: "30",
          progress: 23,
          achieved: false,
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
        <motion.header
          className="text-center mb-16 relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/50 to-purple-100/50 blur-3xl -z-10"></div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-indigo-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Welcome to LifeStat
          </h1>
          <p className="text-xl sm:text-2xl text-indigo-700 max-w-2xl mx-auto">
            Your Personal Life Tracker - Measure your life's stats and achieve your goals
          </p>
        </motion.header>

        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center border border-white/20">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-indigo-800">Stats for Your Life Journey</h2>
            <p className="text-lg mb-8 text-gray-700 leading-relaxed max-w-3xl mx-auto">
              LifeStat is your all-in-one solution for tracking and understanding every quantitative aspect of your
              life. Visualize your journey, celebrate achievements, and unlock your full potential.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white/50 backdrop-blur-sm rounded-xl p-6 flex flex-col items-center text-center transition-all hover:shadow-lg hover:bg-white/80 border border-white/20"
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="bg-indigo-100 rounded-full p-3 mb-4">
                    <feature.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-indigo-800 mb-2">{feature.text}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.div
          className="flex flex-col items-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="text-center mb-8 ">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4 mt-10 text-indigo-800">See LifeStat in Action</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience how LifeStat helps you track and achieve your goals with our interactive demo
            </p>
          </div>
          <div className="w-full max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {demoCategories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="transform hover:scale-[1.02] transition-transform duration-200"
                >
                  <DemoCategory {...category} />
                </motion.div>
              ))}
            </div>
            <div className="mt-8 text-center space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                  <p className="text-gray-700 font-medium">Track both numerical stats and task-based goals</p>
                </div>
                <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                  <p className="text-gray-700 font-medium">Visualize progress with clean and simple charts</p>
                </div>
                <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                  <p className="text-gray-700 font-medium">Organize everything into customizable categories</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center border border-white/20">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-indigo-800">Get Started Today</h2>
            {currentUser ? (
              <p className="text-lg text-gray-700">
                Welcome back, <span className="font-semibold">{currentUser.email}</span>! Continue your journey of
                self-improvement and life tracking.
              </p>
            ) : (
              <div>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed max-w-2xl mx-auto">
                  Ready to take control of your life's statistics? Sign up or log in to begin your LifeStat journey and
                  unlock your full potential!
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <motion.a
                    href="/register"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 inline-flex items-center shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </motion.a>
                  <motion.a
                    href="/login"
                    className="bg-white hover:bg-gray-50 text-indigo-800 font-bold py-3 px-8 rounded-lg transition duration-300 shadow-lg hover:shadow-xl border border-indigo-100"
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

