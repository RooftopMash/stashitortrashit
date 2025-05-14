import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

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

// User Signup with Social Media Links
document.getElementById("userSignupBtn").onclick = async () => {
  const email = document.getElementById("userSignupEmail").value;
  const password = document.getElementById("userSignupPassword").value;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: email,
      country: document.getElementById("userCountry").value,
      phone: document.getElementById("userPhone").value,
      facebook: document.getElementById("userFacebook").value,
      instagram: document.getElementById("userInstagram").value,
      twitter: document.getElementById("userTwitter").value,
      linkedin: document.getElementById("userLinkedIn").value,
      tiktok: document.getElementById("userTikTok").value
    });
    alert("Account created successfully with social media links.");
  } catch (error) {
    alert("Signup failed: " + error.message);
  }
};

// Function to Toggle Signup Forms
function toggleUserSignup() {
  document.getElementById("userSignup").classList.toggle("hidden");
}

function toggleBrandSignup() {
  document.getElementById("brandSignup").classList.toggle("hidden");
}
