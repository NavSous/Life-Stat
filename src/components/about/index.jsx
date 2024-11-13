import React from 'react';
import { useAuth } from '../../contexts/authContext';

const About = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
        <header className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-blue-600">LifeStat</h1>
          <p className="text-xl sm:text-2xl text-blue-500 max-w-3xl mx-auto">Transforming Personal Growth into an Epic Adventure</p>
        </header>
        
        <section className="mb-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold mb-6 text-blue-700">Your Journey Begins Here</h2>
          <p className="text-lg sm:text-xl mb-8 max-w-4xl mx-auto text-gray-700 leading-relaxed">
            Welcome to LifeStat – where personal development meets gamification. We've reimagined the path to self-improvement, 
            turning everyday life into an exciting quest for growth and achievement. Our platform is designed to empower you 
            to take control of your life's narrative, transforming abstract goals into tangible progress.
          </p>
        </section>

        <section className="mb-16 bg-white rounded-2xl shadow-xl p-8 sm:p-12">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-8 text-blue-600 text-center">Unleash Your Potential with LifeStat</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ul className="space-y-4 text-lg">
              {[
                "Craft your unique life dashboard",
                "Visualize goal progress and conquer milestones",
                "Master your finances with ease",
                "Sculpt your ideal fitness journey"
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <ul className="space-y-4 text-lg">
              {[
                "Forge unbreakable healthy habits",
                "Dominate your academic pursuits",
                "Bring personal projects to life",
                "Integrate all aspects of your life seamlessly"
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold mb-6 text-blue-700">The LifeStat Philosophy</h2>
          
          <div className="bg-blue-100 rounded-xl p-6 sm:p-8 max-w-3xl mx-auto">
            <p className="text-lg text-gray-700 mb-4">
              We believe that meaningful change comes from consistent, measurable actions. By breaking down your aspirations into 
              trackable stats and goals, we make the journey to your ideal self clear and achievable. Whether you're aiming 
              for financial freedom, peak physical fitness, or mastery in your field, LifeStat provides the framework to turn your 
              ambitions into reality.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold mb-8 text-blue-700 text-center">The Power of Holistic Tracking</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">Interconnected Life Areas</h3>
              <p className="text-gray-700">
                LifeStat recognizes that all aspects of your life are interconnected. Our platform allows you to see how progress 
                in one area positively impacts others, providing a comprehensive view of your personal growth journey.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">Data-Driven Insights</h3>
              <p className="text-gray-700">
                By tracking your daily activities and progress, LifeStat generates valuable insights. These data-driven 
                recommendations help you optimize your routines and make informed decisions about where to focus your efforts.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;