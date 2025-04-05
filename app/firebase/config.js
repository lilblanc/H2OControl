import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyCpvRBgAP4rqGORvQl4UgsiSa0grWu95mI",
    authDomain: "sistemademonitoramento-32fb9.firebaseapp.com",
    databaseURL: "https://sistemademonitoramento-32fb9-default-rtdb.firebaseio.com",
    projectId: "sistemademonitoramento-32fb9",
    storageBucket: "sistemademonitoramento-32fb9.firebasestorage.app",
    messagingSenderId: "439173709729",
    appId: "1:439173709729:web:b7aa619972946ab32a55e0"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
