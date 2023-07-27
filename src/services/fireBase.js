// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6xAuojxElSa1b4m-lal3grbztXipDSA8",
  authDomain: "smartenvironmentalmonitoring.firebaseapp.com",
  databaseURL:
    "https://smartenvironmentalmonitoring-default-rtdb.firebaseio.com",
  projectId: "smartenvironmentalmonitoring",
  storageBucket: "smartenvironmentalmonitoring.appspot.com",
  messagingSenderId: "1005948964364",
  appId: "1:1005948964364:web:d68b60083618b35e57a829",
  measurementId: "G-F26FZP6RWJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const database = getDatabase(app);
