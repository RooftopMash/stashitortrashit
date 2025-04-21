import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBu1iRSWC3l7VGJvHyD49xXqqGdEIa9Kis", // Your actual API Key here
  authDomain: "stashortrash-acbbf.firebaseapp.com",
  projectId: "stashortrash-acbbf",
  storageBucket: "stashortrash-acbbf.appspot.com",
  messagingSenderId: "782905521538",
  appId: "1:782905521538:web:856d1e7789edd76882cb9b",
  measurementId: "G-8Y4ZXJTPM6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

// Sign Up functionality
document.getElementById("signup-btn").addEventListener("click", () => {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // User signed up successfully
      const user = userCredential.user;
      alert("Sign Up successful!");
      // Optionally redirect to another page or show logged-in screen
      document.getElementById("signup").style.display = "none";  // Hide sign up form
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(`Sign Up Failed: ${errorMessage}`);
    });
});

// Log In functionality
document.getElementById("login-btn").addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // User logged in successfully
      const user = userCredential.user;
      alert("Log In successful!");
      // Hide login form and show main app
      document.getElementById("login").style.display = "none";  // Hide login form
      // Optionally show user-specific features after login
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(`Login Failed: ${errorMessage}`);
    });
});
