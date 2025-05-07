// Firebase Config
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

// Firebase Configuration
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
const storage = getStorage(app);

// User Login
document.getElementById("userLoginBtn")?.addEventListener("click", async () => {
  const email = document.getElementById("userLoginEmail").value;
  const password = document.getElementById("userLoginPassword").value;
  const user = await signInWithEmailAndPassword(auth, email, password);
  window.location.href = "dashboard.html";
});

// User Signup
document.getElementById("userSignupBtn")?.addEventListener("click", async () => {
  const email = document.getElementById("userSignupEmail").value;
  const password = document.getElementById("userSignupPassword").value;
  await createUserWithEmailAndPassword(auth, email, password);
  window.location.href = "dashboard.html";
});

// Logout User
function logoutUser() {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
}

// Save Profile
async function saveProfile() {
  const user = auth.currentUser;
  const file = document.getElementById("profileImage").files[0];
  const country = document.getElementById("userCountry").value;
  const phone = document.getElementById("userPhone").value;

  if (file) {
    const fileRef = ref(storage, `profiles/${user.uid}`);
    await uploadBytes(fileRef, file);
  }

  await setDoc(doc(db, "users", user.uid), { country, phone }, { merge: true });
  alert("Profile updated!");
}
