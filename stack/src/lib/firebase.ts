// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCebZM4RCn1XvvQfCmQsljcMDptJo65LmY",
  authDomain: "stack-overflow-d86b6.firebaseapp.com",
  projectId: "stack-overflow-d86b6",
  storageBucket: "stack-overflow-d86b6.firebasestorage.app",
  messagingSenderId: "296999347180",
  appId: "1:296999347180:web:c149558abda4118dbad6c9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);