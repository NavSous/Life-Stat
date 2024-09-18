// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDIzYZD3eB-ODrehbYOefN61KBl8NU7V_E",
  authDomain: "life-stat-9e493.firebaseapp.com",
  projectId: "life-stat-9e493",
  storageBucket: "life-stat-9e493.appspot.com",
  messagingSenderId: "47618686938",
  appId: "1:47618686938:web:476701a61f75dfd9590ae3",
  measurementId: "G-JJMWX8WZB5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)
export{app, auth}