import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


// Initialize Firebase with your config
const firebaseConfig = {
    apiKey: "AIzaSyD0I8XnQ82qt4hkFgl9g6U4M1LrAzouvn0",
    authDomain: "monupn-74873.firebaseapp.com",
    projectId: "monupn-74873",
    storageBucket: "monupn-74873.appspot.com",
    messagingSenderId: "123855293482",
    appId: "1:123855293482:web:4c4c59967ec3d6bb634753",
    measurementId: "G-4M96HQNDH1"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
