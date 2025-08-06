// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCr7-Ya8x19u9EdtCi9smU6l9TTe_N6ly8",
  authDomain: "online-services-4e3ab.firebaseapp.com",
  projectId: "online-services-4e3ab",
  storageBucket: "online-services-4e3ab.appspot.com", 
  messagingSenderId: "543839759607",
  appId: "1:543839759607:web:f9e770a9ffeae54ce137f2",
  measurementId: "G-NDVRR4TK7Z"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
