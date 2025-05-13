// Firebase Setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBu1iRSWC3l7VGJvHyD49xXqqGdEIa9Kis",
  authDomain: "stashortrash-acbbf.firebaseapp.com",
  projectId: "stashortrash-acbbf",
  storageBucket: "stashortrash-acbbf.appspot.com",
  messagingSenderId: "782905521538",
  appId: "1:782905521538:web:856d1e7789edd76882cb9b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Toggle User/Brand Forms
window.showUserForm = () => {
  document.getElementById("userForm").style.display = "block";
  document.getElementById("brandForm").style.display = "none";
};

window.showBrandForm = () => {
  document.getElementById("userForm").style.display = "none";
  document.getElementById("brandForm").style.display = "block";
};

// User Login
document.getElementById("userLoginBtn").onclick = async () => {
  const email = userLoginEmail.value;
  const password = userLoginPassword.value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (error) {
    alert("User Login Failed: " + error.message);
  }
};

// User Signup
document.getElementById("userSignupBtn").onclick = async () => {
  const email = userSignupEmail.value;
  const password = userSignupPassword.value;
  const country = userCountryDropdown.value;
  const phone = userPhone.value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", userCredential.user.uid), { email, country, phone });
    window.location.href = "dashboard.html";
  } catch (error) {
    alert("User Signup Failed: " + error.message);
  }
};

// Logout
window.logout = async () => {
  await signOut(auth);
  window.location.href = "index.html";
};
