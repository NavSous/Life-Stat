import React from 'react';
import { useAuth } from '../../contexts/authContext';

const About = () => {
  const { currentUser } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8 ">
      <h1 className="mt-16 text-5xl font-bold mb-8 text-center text-blue-600">LifeStat</h1>
      
      <section className="mb-12 text-center">
        <h2 className="text-3xl font-semibold mb-4 text-blue-500">Your Journey Begins Here</h2>
        <p className="text-xl mb-6 max-w-3xl mx-auto">
          Welcome to LifeStat – making growth and achievement simple. Dive into a world where every aspect of your life becomes a thrilling quest for improvement!
        </p>
      </section>

      <section className="mb-12 bg-white rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500">Unleash Your Potential with LifeStat</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
          <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Craft your unique life dashboard</li>
          <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Visualize goal progress and conquer milestones</li>
          <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Master your finances with ease</li>
          <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Sculpt your ideal fitness journey</li>
          <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Forge unbreakable healthy habits</li>
          <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Dominate your academic pursuits</li>
          <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Bring personal projects to life</li>
        </ul>
      </section>

      <section className="mb-12 text-center">
        <h2 className="text-3xl font-semibold mb-4 text-blue-500">Life as an Epic Game</h2>
        <p className="text-xl mb-6 max-w-3xl mx-auto">
          Imagine your life as the most exciting game you've ever played. With LifeStat, every day becomes a new level to conquer. Track your stats, complete goals, and achieve anything!
        </p>
      </section>

      <section className="text-center bg-blue-50 rounded-lg p-8">
        <h2 className="text-3xl font-semibold mb-4 text-blue-600">Your Adventure Awaits</h2>
        {currentUser ? (
          <p className="text-xl">
            Welcome back, {currentUser.email}! – what incredible feats will you accomplish today?
          </p>
        ) : (
          <p className="text-xl">
            The journey of a lifetime is just a click away. Sign up now to create your character and begin!
          </p>
        )}
      </section>
    </div>
  );
};

export default About;