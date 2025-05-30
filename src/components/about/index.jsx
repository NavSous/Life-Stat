"use client"
import { useAuth } from "../../contexts/authContext"
import { motion } from "framer-motion"
import { CheckCircle, TrendingUp, Brain, Zap, BarChart2, Target } from "lucide-react"

const About = () => {
  const { currentUser } = useAuth()

  const features = [
    { icon: TrendingUp, text: "Craft your unique life dashboard" },
    { icon: Target, text: "Visualize goal progress and conquer milestones" },
    { icon: BarChart2, text: "Master your finances with ease" },
    { icon: Zap, text: "Sculpt your ideal fitness journey" },
    { icon: Brain, text: "Forge unbreakable healthy habits" },
    { icon: CheckCircle, text: "Dominate your academic pursuits" },
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
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-indigo-600 font-quantify">ViveStat</h1>
          <p className="text-xl sm:text-2xl text-indigo-500 max-w-3xl mx-auto">
            Transforming Personal Growth into an Epic Adventure
          </p>
        </motion.header>

        <motion.section
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl sm:text-4xl font-semibold mb-6 text-indigo-700">Your Journey Begins Here</h2>
          <p className="text-lg sm:text-xl mb-8 max-w-4xl mx-auto text-gray-700 leading-relaxed">
            Welcome to ViveStat – where personal development meets gamification. We've reimagined the path to
            self-improvement, turning everyday life into an exciting quest for growth and achievement.
          </p>
        </motion.section>

        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 backdrop-blur-sm bg-opacity-80">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-8 text-indigo-600 text-center">
              Unleash Your Potential with ViveStat
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-4 bg-indigo-50 rounded-xl p-4 transition-all hover:shadow-md hover:bg-indigo-100"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <feature.icon className="w-8 h-8 text-indigo-500" />
                  <span className="text-indigo-800">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-semibold mb-6 text-indigo-700">The ViveStat Philosophy</h2>

          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto shadow-lg">
            <p className="text-lg text-gray-700 mb-4">
              We believe that meaningful change comes from consistent, measurable actions. By breaking down your
              aspirations into trackable stats and goals, we make the journey to your ideal self clear and achievable.
            </p>
          </div>
        </motion.section>

        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl font-semibold mb-8 text-indigo-700 text-center">
            The Power of Holistic Tracking
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl shadow-lg p-6 backdrop-blur-sm bg-opacity-80">
              <h3 className="text-xl font-semibold mb-4 text-indigo-600">Interconnected Life Areas</h3>
              <p className="text-gray-700">
                ViveStat recognizes that all aspects of your life are interconnected. Our platform allows you to see how
                progress in one area positively impacts others, providing a comprehensive view of your personal growth
                journey.
              </p>
            </div>
            <div className="bg-white rounded-3xl shadow-lg p-6 backdrop-blur-sm bg-opacity-80">
              <h3 className="text-xl font-semibold mb-4 text-indigo-600">Data-Driven Insights</h3>
              <p className="text-gray-700">
                By tracking your daily activities and progress, ViveStat generates valuable insights. These data-driven
                recommendations help you optimize your routines and make informed decisions about where to focus your
                efforts.
              </p>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <h2 className="text-3xl sm:text-4xl font-semibold mb-8 text-indigo-700">Start Your Journey Today</h2>
          <motion.a
            href="/register"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Begin Your Adventure
          </motion.a>
        </motion.section>
      </div>
    </div>
  )
}

export default About

