// Firebase Configuration and Initialization
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDU_9StXYaXjj_gbqSvHo7xOidapWdFuq0",
  authDomain: "ssia-academy-management-system.firebaseapp.com",
  databaseURL: "https://ssia-academy-management-system-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "ssia-academy-management-system",
  storageBucket: "ssia-academy-management-system.firebasestorage.app",
  messagingSenderId: "119687873655",
  appId: "1:119687873655:web:46b5b35bfe27ec978d7272",
  measurementId: "G-7TPLXKL9E1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const analytics = getAnalytics(app);
export const database = getDatabase(app);
export const auth = getAuth(app);

export default app;