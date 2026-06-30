import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB5HyZfoKdasYHBdXQpmjt9I1hPqu0xnA8",
  authDomain: "pokedex-final-fbc43.firebaseapp.com",
  projectId: "pokedex-final-fbc43",
  storageBucket: "pokedex-final-fbc43.firebasestorage.app",
  messagingSenderId: "427573203196",
  appId: "1:427573203196:web:3e5804ac7b264829734779",
  measurementId: "G-9F8WHJR3LP"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);