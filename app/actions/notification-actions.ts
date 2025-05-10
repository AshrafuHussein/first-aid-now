"use server"

import { cookies } from "next/headers"

// This function runs on the server and safely accesses the VAPID key
export async function getFcmConfig() {
  // Return only what's needed for the client
  // The VAPID key stays on the server
  return {
    // We can return a boolean indicating if FCM is configured
    // without exposing the actual key
    fcmConfigured: !!process.env.FIREBASE_VAPID_KEY,
  }
}

// This function will store the FCM token in a cookie or database
export async function storeFcmToken(token: string, userId: string) {
  try {
    // Store in a cookie for now (you might want to store in your database instead)
    cookies().set("fcm_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    // You can also store in your database here
    // await db.collection('fcmTokens').doc(userId).set({
    //   token,
    //   userId,
    //   createdAt: new Date()
    // })

    return { success: true }
  } catch (error) {
    console.error("Error storing FCM token:", error)
    return { success: false, error: "Failed to store token" }
  }
}
