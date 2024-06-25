// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore';
import { getDatabase } from 'firebase/database';
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDetph9YyDVwr3iA5AGBSOyZXNxtpbIPpE",
  authDomain: "leconnect-70d19.firebaseapp.com",
  projectId: "leconnect-70d19",
  storageBucket: "leconnect-70d19.appspot.com",
  messagingSenderId: "646981449451",
  appId: "1:646981449451:web:4c91a3a0ac6618df5a30ae",
  measurementId: "G-77NHCEX0DE"
};

// Initialize Firebase
export const FIREBASE_APP = firebase.initializeApp(firebaseConfig);

// Initialize Firestore
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);

// Initialize Authentication
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const FIREBASE_STORAGE = firebase.storage();
