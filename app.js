import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBu1iRSWC3l7VGJvHyD49xXqqGdEIa9Kis",
  authDomain: "stashortrash-acbbf.firebaseapp.com",
  projectId: "stashortrash-acbbf",
  storageBucket: "stashortrash-acbbf.firebasestorage.app",
  messagingSenderId: "782905521538",
  appId: "1:782905521538:web:856d1e7789edd76882cb9b",
  measurementId: "G-8Y4ZXJTPM6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        // Sign user in
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log("User logged in:", user);

        // Example: Save additional user info to Firestore
        await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            lastLogin: new Date().toISOString()
        });

        // Redirect or show user's profile
        window.location.href = "dashboard.html";  // or any other page
    } catch (error) {
        console.error("Error logging in:", error);
        alert("Failed to log in. Please try again.");
    }
});
