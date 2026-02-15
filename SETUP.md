# Local Setup Guide for NextHome

Follow these steps to get the **NextHome** project running on your local machine.

---

### Prerequisites
- **Node.js**: Ensure you have Node.js (v18 or later) installed.
- **MongoDB**: You need a MongoDB connection string (Atlas or Local).
- **Firebase**: You need a Firebase project set up for Authentication and Storage.

---

### Step 1: Clone and Install
Open your terminal in the project root and run:
```bash
npm install
```

---

### Step 2: Environment Variables
Create a file named `.env.local` in the root directory and add the following keys. 
> [!NOTE]
> You can find your specific values in the project configuration or by creating new ones on MongoDB Atlas and Firebase Console.

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# JWT Security
JWT_SECRET=any_random_secure_string

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

---

### Step 3: Run Development Server
Start the Next.js development server:
```bash
npm run dev
```
The application will be available at **[http://localhost:3000](http://localhost:3000)**.

---

### Step 4: Build for Production (Optional)
To test the production build locally:
```bash
npm run build
npm start
```

---

### Troubleshooting
- **Module not found**: Run `npm install` again to ensure all dependencies are correctly linked.
- **Firebase Errors**: Ensure your Firebase Storage rules allow read/write access for authenticated users.
- **MongoDB Errors**: Double-check that your IP address is whitelisted in MongoDB Atlas.
