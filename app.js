// App.js - Complete Final Version

// Firebase setup (Using Firebase v9 Modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Firebase Configuration (replace with your config)
const firebaseConfig = {
  apiKey: "AIzaSyBu1iRSWC3l7VGJvHyD49xXqqGdEIa9Kis",
  authDomain: "stashortrash-acbbf.firebaseapp.com",
  projectId: "stashortrash",
  storageBucket: "stashortrash-acbbf.appspot.com",
  messagingSenderId: "782905521538",
  appId: "1:782905521538:web:856d1e7789edd76882cb9b",
  measurementId: "G-8Y4ZXJTPM6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// User Signup Function
document.getElementById("userSignupBtn")?.addEventListener("click", async () => {
  const email = document.getElementById("userSignupEmail").value;
  const password = document.getElementById("userSignupPassword").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, "users", user.uid), { email: email });
    alert("Signup successful. You can now log in.");
    window.location.href = "dashboard.html";
  } catch (error) {
    alert("Error during signup: " + error.message);
  }
});

// User Login Function
document.getElementById("userLoginBtn")?.addEventListener("click", async () => {
  const email = document.getElementById("userLoginEmail").value;
  const password = document.getElementById("userLoginPassword").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (error) {
    alert("Error during login: " + error.message);
  }
});

// Profile Update (Profile.html)
async function updateProfile() {
  const displayName = document.getElementById("displayName").value;
  const phone = document.getElementById("phone").value;

  const user = auth.currentUser;
  if (user) {
    await updateDoc(doc(db, "users", user.uid), { displayName, phone });
    alert("Profile updated successfully!");
  } else {
    alert("User not logged in.");
  }
}

// Logout Function
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
});
