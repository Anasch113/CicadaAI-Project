// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmWIByggJxfGeQ8aWe45G28ezOshKWAhI",
  authDomain: "cicada-ai.firebaseapp.com",
  projectId: "cicada-ai",
  storageBucket: "cicada-ai.appspot.com",
  messagingSenderId: "984127736757",
  appId: "1:984127736757:web:41b8a3c1297b57771827fc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;