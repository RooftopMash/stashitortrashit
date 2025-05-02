// App.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import {
  getFirestore, doc, setDoc, getDoc
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// ✅ Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBu1iRSWC3l7VGJvHyD49xXqqGdEIa9Kis",
  authDomain: "stashortrash-acbbf.firebaseapp.com",
  projectId: "stashortrash-acbbf",
  storageBucket: "stashortrash-acbbf.appspot.com",
  messagingSenderId: "782905521538",
  appId: "1:782905521538:web:856d1e7789edd76882cb9b",
  measurementId: "G-8Y4ZXJTPM6"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Save user data to Firestore if not exists
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
    console.log("📄 User already exists — Firestore document not overwritten");
  }
}

// ✅ Load profile after login
async function loadUserProfile(uid) {
  const userRef = doc(db, "users", uid);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    document.getElementById("profileContainer").style.display = "block";
    document.getElementById("profileEmail").textContent = data.email || "";
    document.getElementById("profileCountry").textContent = data.country || "";
    document.getElementById("profilePhone").textContent = data.phone || "";

    // Calculate Auth %
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

// ✅ Auth state listener
onAuthStateChanged(auth, async (user) => {
  if (user) {
    await saveUserProfile(user);
    loadUserProfile(user.uid);
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("mainSection").style.display = "block";
  } else {
    console.log("❌ No user logged in");
    document.getElementById("mainSection").style.display = "none";
    document.getElementById("loginSection").style.display = "block";
  }
});

// ✅ Login Function
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log("✅ Logged in");
  } catch (err) {
    alert("❌ Login error: " + err.message);
  }
});

// ✅ Sign Up Function
document.getElementById("signupBtn").addEventListener("click", async () => {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    console.log("✅ Signed up and logged in");
  } catch (err) {
    alert("❌ Signup error: " + err.message);
  }
});

// ✅ Logout Function
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  console.log("👋 Logged out");
});
