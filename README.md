# LifeStat - Your Personal Life Tracker

LifeStat is a modern web application that helps you track and visualize various aspects of your life through customizable statistics and goals. Whether you're monitoring fitness progress, reading habits, or any other life metrics, LifeStat provides an intuitive interface to keep track of your journey.

## Features

- 📊 **Customizable Stats**: Track any metric that matters to you
- 🎯 **Goal Setting**: Set both numerical and task-based goals
- 📈 **Progress Visualization**: Real-time progress tracking with visual indicators
- 📁 **Category Organization**: Organize your stats into custom categories
- 🔄 **Interactive Updates**: Modify stats and see goal progress update instantly
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- React.js
- Tailwind CSS
- Firebase (Authentication & Database)
- Framer Motion (Animations)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account and project setup

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/life-stat.git
   cd life-stat
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up Firebase:
   - Create a new Firebase project
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Copy your Firebase configuration

4. Create a `.env` file in the root directory:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

5. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

The application will be available at `http://localhost:3000`.

## Deployment

### Firebase Hosting (Recommended)

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init
   ```
   - Select Hosting
   - Choose your Firebase project
   - Use `build` as your public directory
   - Configure as a single-page app: Yes

4. Build and deploy:
   ```bash
   npm run build
   firebase deploy
   ```

### Alternative Deployment Options

- **Vercel**: Push to GitHub and connect your repository to Vercel
- **Netlify**: Connect your GitHub repository to Netlify
- **GitHub Pages**: Configure for GitHub Pages deployment

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
