import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Firebase config
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
const db = getFirestore(app);
const auth = getAuth(app);

// Dynamically fetch brands from Firestore
const fetchBrands = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "brands"));
    const brands = querySnapshot.docs.map(doc => doc.data().name);
    populateBrandDropdown(brands);
  } catch (error) {
    console.error("Error fetching brands: ", error);
  }
};

// Populate the dropdown with fetched brands
const populateBrandDropdown = (brands) => {
  const brandSelect = document.getElementById("brand");
  brands.forEach((brand) => {
    const option = document.createElement("option");
    option.value = brand;
    option.textContent = brand;
    brandSelect.appendChild(option);
  });
};

// Call fetch on page load
window.onload = fetchBrands;

// Login logic
document.getElementById("login-btn").addEventListener("click", async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.reload();
  } catch (error) {
    console.error("Login failed:", error.message);
    alert("Login failed: " + error.message);
  }
});

// Logout
document.getElementById("logout").addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.reload();
  } catch (error) {
    console.error("Logout failed:", error.message);
  }
});
