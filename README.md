# Cyber_Market FullStack Prototype

A futuristic cyberpunk-themed marketplace prototype application with futuristic looking UI/UX and advanced features.

## Tech Stack

- **React 19** - Modern React framework with latest features
- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS v4** - Utility-first CSS framework
- **Firebase** - Backend services (Authentication, Firestore, Storage)
- **Framer Motion** - Animation library for smooth transitions
- **Three.js** - 3D graphics rendering

## Features

- **Cyberpunk 2077 UI/UX** - Immersive design with glassmorphism and glitch effects
- **3D Item Viewer** - Interactive 3D visualization of marketplace items
- **Inventory Management** - Full-featured inventory system for users
- **User Profile** - Customizable profiles with avatar uploads via Firebase Storage
- **Admin Dashboard** - Administrative controls and management interface

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   
   Create a `.env` file in the root directory with your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   
   Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
CyberMarket/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Application pages
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── firebase/       # Firebase configuration
│   └── types/          # TypeScript type definitions
├── public/             # Static assets
└── package.json        # Project dependencies
```

## Contributing

This project follows modern React and TypeScript best practices. Ensure all code is properly typed and follows the existing conventions.

## License

All rights reserved.


## 🤝 Contributing
This is a prototype project. Feel free to fork and experiment!

---

**Built with ⚡ by EstarinAzx**
