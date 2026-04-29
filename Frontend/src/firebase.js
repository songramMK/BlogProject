// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId: "blogproject-8c5bd",
  storageBucket: "blogproject-8c5bd.firebasestorage.app",
  messagingSenderId: "504959187680",
  appId: "1:504959187680:web:349a008da6fb2b9d322e85",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
