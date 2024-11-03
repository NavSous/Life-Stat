import React from 'react';
import { useAuth } from '../../contexts/authContext';

const About = () => {
  const { currentUser } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
        <section className = "mb-12"></section>
      <h1 className="text-4xl font-bold mb-6">Welcome to LifeStat</h1>
      <section className="mb-8">
      

        <h2 className="text-2xl font-semibold mb-4">Your Personal Life Tracker</h2>
        <p className="text-lg mb-4">
          LifeStat is your all-in-one solution for tracking and gamifying every aspect of your life. Whether you're managing your finances, pursuing fitness goals, or tracking your academic progress, LifeStat helps you visualize your journey and celebrate your achievements.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
        <ul className="list-disc list-inside text-lg space-y-2">
          <li>Customizable stat tracking for various life aspects</li>
          <li>Goal setting and progress visualization</li>
          <li>Financial management tools</li>
          <li>Track Fitness and health metrics</li>
          <li>Help form Healthy Habits</li>
          <li>Stay Ahead on Academics</li>
          <li>Manage Personal Projects</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Life Gamification</h2>
        <p className="text-lg mb-4">
          Turn your life into an exciting game! Set challenges, earn achievements, and watch your progress unfold across all areas of your life. LifeStat makes personal growth engaging and rewarding.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
        {currentUser ? (
          <p className="text-lg">
            Welcome back, {currentUser.email}! Continue your journey of self-improvement and life tracking.
          </p>
        ) : (
          <p className="text-lg">
            Ready to take control of your life's statistics? Sign up or log in to begin your LifeStat journey!
          </p>
        )}
      </section>
    </div>
  );
};

export default About;