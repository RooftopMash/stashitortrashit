import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// 🧠 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBu1iRSWC3l7VGJvHyD49xXqqGdEIa9Kis",
  authDomain: "stashortrash-acbbf.firebaseapp.com",
  projectId: "stashortrash-acbbf",
  storageBucket: "stashortrash-acbbf.appspot.com",
  messagingSenderId: "782905521538",
  appId: "1:782905521538:web:856d1e7789edd76882cb9b",
  measurementId: "G-8Y4ZXJTPM6"
};

// 🛠️ Init Services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔐 Signup
document.getElementById("signupBtn").addEventListener("click", async () => {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    console.log("✅ Signed up:", userCred.user.email);
  } catch (error) {
    console.error("❌ Signup error:", error.message);
  }
});

// 🔐 Login
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    console.log("✅ Logged in:", userCred.user.email);
  } catch (error) {
    console.error("❌ Login error:", error.message);
  }
});

// 🚪 Logout
document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    await signOut(auth);
    location.reload();
  } catch (error) {
    console.error("❌ Logout error:", error.message);
  }
});

// 📄 Save Profile to Firestore
async function saveUserProfile(user) {
  const userRef = doc(db, "users", user.uid);
  const existing = await getDoc(userRef);
  if (!existing.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      country: "",
      phone: "",
      address: "",
      socialLinks: {
        linkedin: "",
        facebook: "",
        twitter: "",
        instagram: ""
      },
      authLevel: 0,
      createdAt: new Date().toISOString()
    });
    console.log("✅ New user profile created in Firestore");
  } else {
    console.log("📄 User already exists in Firestore");
  }
}

// 📥 Load Profile UI
async function loadUserProfile(uid) {
  const userRef = doc(db, "users", uid);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    document.getElementById("profileEmail").textContent = data.email || "";
    document.getElementById("profileCountry").textContent = data.country || "";
    document.getElementById("profilePhone").textContent = data.phone || "";

    let filled = 0;
    for (let key in data.socialLinks) {
      if (data.socialLinks[key]) filled++;
    }
    const authPercent = Math.round((filled / 4) * 100);
    document.getElementById("profileAuth").textContent = `${authPercent}%`;
  } else {
    console.log("⚠️ User profile not found");
  }
}

// 🧠 Auth State Listener
onAuthStateChanged(auth, async (user) => {
  if (user) {
    document.getElementById("authSection").style.display = "none";
    document.getElementById("mainSection").style.display = "block";
    await saveUserProfile(user);
    await loadUserProfile(user.uid);
  } else {
    document.getElementById("authSection").style.display = "block";
    document.getElementById("mainSection").style.display = "none";
  }
});
