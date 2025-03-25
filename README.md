# ViveStat

ViveStat is a modern web application designed to help users track and manage various aspects of their life through customizable categories, stats, and goals. Built with React and Firebase, it offers a seamless user experience with real-time updates and data persistence.

## Features

- 🔐 **Secure Authentication**: User-friendly sign-up and login system
- 📊 **Category Management**: Create and organize different life aspects
- 📈 **Stat Tracking**: Monitor numerical values with real-time updates
- 🎯 **Goal Setting**: Set and track progress towards your objectives
- 📱 **Responsive Design**: Works seamlessly across all devices
- 🌙 **Dark Mode**: Comfortable viewing experience in any lighting condition
- 🔄 **Real-time Updates**: Instant data synchronization across devices
- 🎨 **Modern UI**: Clean and intuitive interface

## Tech Stack

- **Frontend**: React.js with Vite
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Deployment**: Firebase Hosting

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Git (for version control)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/vivestat.git
   cd vivestat
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a Firebase project and enable Authentication and Firestore

4. Create a `.env` file in the root directory with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:5173`

## Deployment

### Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase:
   ```bash
   firebase init
   ```

4. Build the project:
   ```bash
   npm run build
   ```

5. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

### Alternative Deployment Options

- Vercel
- Netlify
- GitHub Pages

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@vivestat.com or open an issue in the repository.
