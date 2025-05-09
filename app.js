// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBu1iRSWC3l7VGJvHyD49xXqqGdEIa9Kis",
  authDomain: "stashortrash-acbbf.firebaseapp.com",
  projectId: "stashortrash-acbbf",
  storageBucket: "stashortrash-acbbf.appspot.com",
  messagingSenderId: "782905521538",
  appId: "1:782905521538:web:856d1e7789edd76882cb9b",
  measurementId: "G-8Y4ZXJTPM6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// User Login
document.getElementById("userLoginBtn")?.addEventListener("click", async () => {
  const email = document.getElementById("userLoginEmail").value;
  const password = document.getElementById("userLoginPassword").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (error) {
    alert("Login failed: " + error.message);
  }
});

// User Signup
document.getElementById("userSignupBtn")?.addEventListener("click", async () => {
  const email = document.getElementById("userSignupEmail").value;
  const password = document.getElementById("userSignupPassword").value;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: email,
      country: document.getElementById("userCountryDropdown").value,
      phone: document.getElementById("userPhone").value
    });
    window.location.href = "dashboard.html";
  } catch (error) {
    alert("Signup failed: " + error.message);
  }
});

// Logout Function
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

// Profile Data Load
document.addEventListener("DOMContentLoaded", async () => {
  const user = auth.currentUser;
  if (user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      document.getElementById("userEmail").textContent = userDoc.data().email;
      document.getElementById("userCountry").textContent = userDoc.data().country;
      document.getElementById("userPhone").textContent = userDoc.data().phone;
    }
  } else {
    window.location.href = "index.html";
  }
});
