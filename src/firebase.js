import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBUqkWytzMms8nYV3n83BN87XAU7Cyu1Wc",
    authDomain: "chat-6a4a6.firebaseapp.com",
    projectId: "chat-6a4a6",
    storageBucket: "chat-6a4a6.appspot.com",
    messagingSenderId: "5304565793",
    appId: "1:5304565793:web:313eac9229f997871aa360"
  };


export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()