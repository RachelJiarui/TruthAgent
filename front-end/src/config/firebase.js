// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvjXQ2Kyfamt7FwHnLDkiFRSwuDctVjU0",
  authDomain: "truthagent-47049.firebaseapp.com",
  projectId: "truthagent-47049",
  storageBucket: "truthagent-47049.appspot.com",
  messagingSenderId: "885449105708",
  appId: "1:885449105708:web:d7c85434817a8d98558c89"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, db };