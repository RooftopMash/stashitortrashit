// Firebase Setup (Ensure your Firebase config is correct)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

// Login & Signup Functions
document.getElementById("userLoginBtn")?.addEventListener("click", async () => {
  const email = document.getElementById("userLoginEmail").value;
  const password = document.getElementById("userLoginPassword").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (error) {
    alert(error.message);
  }
});

// Profile Save Function
async function saveProfile() {
  const user = auth.currentUser;
  if (user) {
    const profileRef = doc(db, "users", user.uid);
    await setDoc(profileRef, {
      country: document.getElementById("profileCountry").value,
      address: document.getElementById("profileAddress").value,
      phone: document.getElementById("profilePhone").value
    });
    alert("Profile saved.");
  }
}

// Logout Function
function logout() {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
}

// Exporting Functions for HTML Usage
window.saveProfile = saveProfile;
window.logout = logout;
