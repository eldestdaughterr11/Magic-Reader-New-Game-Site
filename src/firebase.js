import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC3RVHw2zwA2rJsewn1pkyTvitetGi7soI",
  authDomain: "magic-reader-ea738.firebaseapp.com",
  projectId: "magic-reader-ea738",
  storageBucket: "magic-reader-ea738.appspot.com",
  messagingSenderId: "601473154718",
  appId: "1:601473154718:web:a81f8c735380b2d70c458f",
  measurementId: "G-M480JGT364"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
