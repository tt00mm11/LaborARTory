// 日時をいい感じの形式にする関数
function convertFromFirestoreTimestampToDatetime(timestamp) {
    const _d = timestamp ? new Date(timestamp * 1000) : new Date();
    const Y = _d.getFullYear();
    const m = (_d.getMonth() + 1).toString().padStart(2, '0');
    const d = _d.getDate().toString().padStart(2, '0');
    const H = _d.getHours().toString().padStart(2, '0');
    const i = _d.getMinutes().toString().padStart(2, '0');
    const s = _d.getSeconds().toString().padStart(2, '0');
    return `${Y}/${m}/${d} ${H}:${i}:${s}`;
}

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
    onValue,
} from "firebase/database";

import {
    getFirestore,
    collection,
    doc,
    addDoc,
    setDoc,
    getDoc,
    getDocs,
    deleteDoc,
    serverTimestamp,
    query,
    orderBy,
    onSnapshot,
} from "firebase/firestore";

import {
    getStorage,
    ref,
    uploadBytes,
} from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyARCEa1-l0Ac1dhlE1Aiy5DKTDqqS_rhz8",
    authDomain: "laborartory-ed692.firebaseapp.com",
    projectId: "laborartory-ed692",
    storageBucket: "laborartory-ed692.appspot.com",
    messagingSenderId: "350952690894",
    appId: "1:350952690894:web:c118c96f783d89f252ec9f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const storage = getStorage(app);

export {
    convertFromFirestoreTimestampToDatetime,
    getFirestore,
    collection,
    doc,
    addDoc,
    setDoc,
    getDoc,
    getDocs,
    deleteDoc,
    serverTimestamp,
    query,
    orderBy,
    onSnapshot,
    db,
    storage,
    ref,
    uploadBytes,
}