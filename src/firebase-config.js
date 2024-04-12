import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD7ha2jFViG0FioRv4JkIkoFvKxCjZwV50",
  authDomain: "datashaper-cd9bf.firebaseapp.com",
  databaseURL:
    "https://datashaper-cd9bf-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "datashaper-cd9bf",
  storageBucket: "datashaper-cd9bf.appspot.com",
  messagingSenderId: "595304528988",
  appId: "1:595304528988:web:cd164f665c971cfe47ba99",
  measurementId: "G-G62BPZ082L",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { auth, analytics, GoogleAuthProvider, signInWithPopup, signOut };
