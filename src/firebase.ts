import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDkd4maiRBZ_Nc-cowlw-vAf6yCM4rXHIQ",
  authDomain: "fitness-1e1d8.firebaseapp.com",
  projectId: "fitness-1e1d8",
  storageBucket: "fitness-1e1d8.appspot.com",
  messagingSenderId: "593633650260",
  appId: "1:593633650260:web:7f84ee53a52b794c0bafc1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);



