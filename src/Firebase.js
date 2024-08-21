import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_fJnmM3ZSPTiduVXrbrRG_vLBntupIiE",
  authDomain: "chat-app-react-f5313.firebaseapp.com",
  projectId: "chat-app-react-f5313",
  storageBucket: "chat-app-react-f5313.appspot.com",
  messagingSenderId: "308506354454",
  appId: "1:308506354454:web:ba02811ea0720fe54c2637",
  measurementId: "G-QG3XX48W5S",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const analytics = getAnalytics(app);
const db = getFirestore(app); // Initialize Firestore

export { app, auth, db }; // Export Firestore
