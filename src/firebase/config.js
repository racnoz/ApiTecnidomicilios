// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
//import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore/lite'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXrHrLg89z6bRh83b8gD05bQ4Di6vOnMk",
  authDomain: "tecnidomicilios-api.firebaseapp.com",
  projectId: "tecnidomicilios-api",
  storageBucket: "tecnidomicilios-api.appspot.com",
  messagingSenderId: "580341965517",
  appId: "1:580341965517:web:3367c093d828f509953f84"
};

// Initialize Firebase
const FirebaseApp = initializeApp(firebaseConfig)

//export const FirebaseAuth = getAuth (FirebaseApp)

export const FirebaseDB = getFirestore(FirebaseApp)

