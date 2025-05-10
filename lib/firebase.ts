import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getMessaging } from "firebase/messaging"

// Check if Firebase config is available
const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
const firebaseAuthDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
const firebaseProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
const firebaseStorageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
const firebaseMessagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
const firebaseAppId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID

// For development/testing purposes - REMOVE IN PRODUCTION
const fallbackConfig = {
  apiKey: "AIzaSyBmT4WMjWjqQbk1mxYU5N9h5MmOUIiJMEE",
  authDomain: "firstaidnow-demo.firebaseapp.com",
  projectId: "firstaidnow-demo",
  storageBucket: "firstaidnow-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef",
}

// Use environment variables if available, otherwise use fallback for development
const firebaseConfig = {
  apiKey: firebaseApiKey || fallbackConfig.apiKey,
  authDomain: firebaseAuthDomain || fallbackConfig.authDomain,
  projectId: firebaseProjectId || fallbackConfig.projectId,
  storageBucket: firebaseStorageBucket || fallbackConfig.storageBucket,
  messagingSenderId: firebaseMessagingSenderId || fallbackConfig.messagingSenderId,
  appId: firebaseAppId || fallbackConfig.appId,
}

// Log warning if using fallback config
if (!firebaseApiKey) {
  console.warn(
    "Firebase environment variables not found. Using fallback configuration for development purposes only. Please set up proper environment variables for production.",
  )
}

// Initialize Firebase
let app
let auth
let db
let messaging = null

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
  auth = getAuth(app)
  db = getFirestore(app)

  // Initialize Firebase Cloud Messaging only on client side
  if (typeof window !== "undefined") {
    try {
      messaging = getMessaging(app)
    } catch (error) {
      console.error("Firebase messaging failed to initialize:", error)
    }
  }
} catch (error) {
  console.error("Firebase initialization error:", error)
}

export { app, auth, db, messaging }
