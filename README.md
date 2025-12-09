# My Progress Companion

A modern PWA for tracking tasks, habits, and health goals. Built with React, Vite, Firebase, and Tailwind CSS.

## Features
- Task, habit, and health tracking
- Firebase authentication and Firestore data storage
- Responsive design for mobile and desktop
- Progressive Web App (PWA): installable, offline support
- Daily notifications (browser permission required)

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/my-progress-companion.git
cd my-progress-companion
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory with your Firebase config:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Run locally
```bash
npm run dev
```

### 5. Build for production
```bash
npm run build
```

## Deploying to Vercel
1. Push your code to GitHub/GitLab/Bitbucket.
2. Go to [Vercel](https://vercel.com), import your repo, and deploy.
3. Add your environment variables in the Vercel dashboard.

## PWA Installation
- Open the deployed site on your mobile browser.
- Tap "Add to Home Screen" to install as an app.

## Notifications
- Allow notification permission when prompted.
- You will receive daily reminders to complete your tasks.

## License
MIT
