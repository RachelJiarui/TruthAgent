// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyARQjUpFX4z_0GA3fqw7LW2AUbAIVScEMg",
  authDomain: "truthagent-c7b90.firebaseapp.com",
  projectId: "truthagent-c7b90",
  storageBucket: "truthagent-c7b90.appspot.com",
  messagingSenderId: "796483652918",
  appId: "1:796483652918:web:2e210401de6b9d370af797"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Authentication
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
