// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7bYizj_xNe2FnYnCnkAxga-3hYz_F2zA",
  authDomain: "mern-blog-f9f91.firebaseapp.com",
  projectId: "mern-blog-f9f91",
  storageBucket: "mern-blog-f9f91.appspot.com",
  messagingSenderId: "1052722219568",
  appId: "1:1052722219568:web:27f9758ab6cbd7f2e67bf5",
  measurementId: "G-K8T2SJ13W9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)