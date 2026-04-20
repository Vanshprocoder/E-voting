import { getApp, getApps, initializeApp } from "firebase/app"
import { getAnalytics, isSupported } from "firebase/analytics"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const requiredKeys = [
  "apiKey",
  "authDomain",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
]

for (const key of requiredKeys) {
  if (!firebaseConfig[key]) {
    throw new Error(`Missing Firebase env value: ${key}`)
  }
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
const db = getFirestore(app)

if (typeof window !== "undefined" && firebaseConfig.measurementId) {
  isSupported().then((supported) => {
    if (supported) getAnalytics(app)
  })
}

export { db }