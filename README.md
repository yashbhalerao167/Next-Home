# NextHome - Modern Real Estate Platform

NextHome is a production-ready, full-stack real estate application migrated from MERN to **Next.js 14**. It features a premium UI, robust search capabilities, and seamless property management.

## 🚀 Features

- **Next.js 14 App Router**: Optimized performance and SEO.
- **Server Components & SSR**: Fast initial load and SEO-friendly listing pages.
- **MongoDB & Mongoose**: Scalable NoSQL database with strict schema modeling.
- **Firebase Auth & Storage**: Secure authentication (with Google OAuth) and multi-image uploads.
- **Redux Toolkit & Persist**: Reliable state management for user sessions.
- **Tailwind CSS**: Modern, responsive design with custom animations.
- **Swiper.js**: Interactive property carousels.

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Redux Toolkit, Swiper
- **Backend**: Next.js Route Handlers (API Routes)
- **Database**: MongoDB
- **Auth/Storage**: Firebase
- **State**: Redux Persist

## 🏁 Getting Started

1. **Clone and Install**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env.local` file with the following:
   ```env
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   # (Include all other Firebase keys)
   ```

3. **Run Dev Server**:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see your app.
