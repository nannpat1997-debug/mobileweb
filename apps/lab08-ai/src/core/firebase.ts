import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD4-1yXoYd6zNrMm7T69GaU_sMYb0XSxBA",
  authDomain: "lab06-expense-59065.firebaseapp.com",
  projectId: "lab06-expense-59065",
  storageBucket: "lab06-expense-59065.firebasestorage.app",
  messagingSenderId: "1042698753047",
  appId: "1:1042698753047:web:900128cd5e2c4ccddb3852",
  measurementId: "G-C0SN4B6VKK"
};

// เติม export หน้า const app
export const app = initializeApp(firebaseConfig); 
export const db = getFirestore(app);