// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js")

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebaseApp = firebase.initializeApp({
  // These values need to be replaced with your actual Firebase config
  // They are hardcoded here because service workers can't access environment variables
  apiKey: "AIzaSyBmT4WMjWjqQbk1mxYU5N9h5MmOUIiJMEE",
  authDomain: "firstaidnow-demo.firebaseapp.com",
  projectId: "firstaidnow-demo",
  storageBucket: "firstaidnow-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef",
  // Note: We don't need to include the VAPID key here
})

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload)

  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo.png",
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
