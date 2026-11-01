// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4JcEaFVOMRfBRfB2YFnInDd-4g1k5VnI",
  authDomain: "arafat-topup-58d44.firebaseapp.com",
  projectId: "arafat-topup-58d44",
  storageBucket: "arafat-topup-58d44.firebasestorage.app",
  messagingSenderId: "388334555374",
  appId: "1:388334555374:web:8f39cbef3309a4b66163ff",
  measurementId: "G-QW9K8V25H5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);