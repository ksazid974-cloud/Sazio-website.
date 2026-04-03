import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAsCSXhw4939IEx379MDiXl9CTVJjvJLEI",
  authDomain: "sazio-1.firebaseapp.com",
  projectId: "sazio-1",
  storageBucket: "sazio-1.firebasestorage.app",
  messagingSenderId: "82743199739",
  appId: "1:82743199739:web:952840299f517d1e47ed5e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
