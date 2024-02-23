import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-explorer-b7f15.firebaseapp.com",
  projectId: "blog-explorer-b7f15",
  storageBucket: "blog-explorer-b7f15.appspot.com",
  messagingSenderId: "724526759846",
  appId: "1:724526759846:web:348506806954690c639967",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
