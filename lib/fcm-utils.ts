import { messaging } from "./firebase"
import { getToken } from "firebase/messaging"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "./firebase"
import { storeFcmToken } from "@/app/actions/notification-actions"

// Remove the firebaseConfig object that contained environment variables

export const requestNotificationPermission = async (userId: string) => {
  if (!messaging) {
    console.warn("Firebase messaging is not initialized")
    return null
  }

  try {
    const permission = await Notification.requestPermission()

    if (permission === "granted") {
      try {
        // Get FCM token without passing the VAPID key directly
        // The VAPID key should be configured in your Firebase project settings
        // and will be automatically used by the Firebase SDK
        const token = await getToken(messaging)

        if (token) {
          // Use the server action to store the token
          await storeFcmToken(token, userId)
        }

        return token
      } catch (error) {
        console.error("Error getting FCM token:", error)
        return null
      }
    }

    return null
  } catch (error) {
    console.error("Error getting notification permission:", error)
    return null
  }
}

export const saveTokenToDatabase = async (userId: string, token: string) => {
  if (!db) {
    console.warn("Firestore is not initialized")
    return
  }

  try {
    // Save the token to Firestore
    const tokenRef = doc(db, "fcmTokens", userId)
    await setDoc(tokenRef, {
      token,
      userId,
      createdAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error saving token to database:", error)
  }
}
