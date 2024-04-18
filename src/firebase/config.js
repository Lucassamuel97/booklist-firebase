
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBPUCE2Ck5qo1REoT3gfDRV7SF0eW3Y5uY",
  authDomain: "book-list-with-firebase-b2116.firebaseapp.com",
  projectId: "book-list-with-firebase-b2116",
  storageBucket: "book-list-with-firebase-b2116.appspot.com",
  messagingSenderId: "668846802558",
  appId: "1:668846802558:web:58fc508d22527f460efa2f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
