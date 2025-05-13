// Firebase Config & Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBu1iRSWC3l7VGJvHyD49xXqqGdEIa9Kis",
  authDomain: "stashortrash-acbbf.firebaseapp.com",
  projectId: "stashortrash-acbbf"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// User Login
async function userLogin() {
  const email = document.getElementById("userLoginEmail").value;
  const password = document.getElementById("userLoginPassword").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login Successful");
  } catch (error) {
    alert("Login failed: " + error.message);
  }
}

// User Signup
async function userSignup() {
  const email = document.getElementById("userSignupEmail").value;
  const password = document.getElementById("userSignupPassword").value;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: email,
      country: document.getElementById("userCountry").value,
      phone: document.getElementById("userPhone").value
    });
    alert("Signup Successful");
  } catch (error) {
    alert("Signup failed: " + error.message);
  }
}

// Show/Hide Forms
function showUserForm() {
  document.getElementById("userForm").style.display = "block";
  document.getElementById("brandForm").style.display = "none";
}

function showBrandForm() {
  document.getElementById("brandForm").style.display = "block";
  document.getElementById("userForm").style.display = "none";
}

function toggleUserSignup() {
  document.getElementById("userSignup").classList.toggle("hidden");
}

function toggleBrandSignup() {
  document.getElementById("brandSignup").classList.toggle("hidden");
}

// Logout
function logout() {
  signOut(auth).then(() => {
    alert("Logged out successfully");
  });
}

window.showUserForm = showUserForm;
window.showBrandForm = showBrandForm;
window.toggleUserSignup = toggleUserSignup;
window.toggleBrandSignup = toggleBrandSignup;
window.userLogin = userLogin;
window.userSignup = userSignup;
window.logout = logout;
