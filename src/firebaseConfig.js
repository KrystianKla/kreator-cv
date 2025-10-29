import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Konfiguracja aplikacji webowej Firebase (skopiowana z konsoli)
// Web app's Firebase configuration (copied from console)
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

for (const key in firebaseConfig) {
  if (firebaseConfig[key] === undefined) {
    console.error(`ERROR: Environment variable for ${key} is missing! Check your .env file and ensure it starts with VITE_`);
  }
}

// Inicjalizacja Firebase
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Inicjalizacja i eksport usług Firebase
// Initialize and export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Dostawcy OAuth
// OAuth Providers
export const googleProvider = new GoogleAuthProvider();
export const linkedInProvider = new OAuthProvider('linkedin.com');