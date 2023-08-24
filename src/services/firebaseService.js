// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCV7CkKE1u0QhJ5wGbKxOH_VavbcoYvxfw",
  authDomain: "galamsey-detector.firebaseapp.com",
  projectId: "galamsey-detector",
  storageBucket: "galamsey-detector.appspot.com",
  messagingSenderId: "1028296053896",
  appId: "1:1028296053896:web:3bfcf9ac458b17ea5fbb3d",
  measurementId: "G-YNQTMEEE9R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const auth = getAuth(app);