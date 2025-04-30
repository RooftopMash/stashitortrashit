import {
  auth,
  db,
  storage
} from "./index.html".firebaseApp;

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  updateDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

// DOM Elements
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const appSection = document.getElementById("app");
const welcomeUser = document.getElementById("welcome-user");
const brandSelect = document.getElementById("brand-select");
const profileSection = document.getElementById("profile-section");

// Show login or signup
window.showSignup = () => {
  loginForm.classList.add("hidden");
  signupForm.classList.remove("hidden");
};

window.showLogin = () => {
  signupForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
};

// Auth
window.signup = async () => {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const country = document.getElementById("signup-country").value;

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCred.user.uid;

    await setDoc(doc(db, "users", uid), {
      email,
      country,
      createdAt: new Date()
    });

    alert("Signup successful!");
  } catch (e) {
    alert("Signup error: " + e.message);
  }
};

window.login = async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    alert("Login failed: " + e.message);
  }
};

window.logout = async () => {
  await signOut(auth);
  location.reload();
};

// Auth state
onAuthStateChanged(auth, async (user) => {
  if (user) {
    loginForm.classList.add("hidden");
    signupForm.classList.add("hidden");
    appSection.classList.remove("hidden");

    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.data();
    welcomeUser.textContent = `Welcome, ${userData?.email || "User"} (${userData?.country || ""})`;

    loadBrands();
    loadProfile();
  }
});

// Load brands
async function loadBrands() {
  const brandsSnap = await getDocs(collection(db, "brands"));
  brandSelect.innerHTML = '<option value="">Select a brand</option>';
  brandsSnap.forEach(doc => {
    const brand = doc.data().name;
    const option = document.createElement("option");
    option.value = brand;
    option.textContent = brand;
    brandSelect.appendChild(option);
  });
}

// Rate product
window.rateProduct = async (type) => {
  const brand = brandSelect.value;
  if (!brand) return alert("Please select a brand.");

  const uid = auth.currentUser.uid;
  const ratingRef = doc(db, "ratings", `${uid}_${brand}`);

  await setDoc(ratingRef, {
    user: uid,
    brand,
    type,
    ratedAt: new Date()
  });

  alert(`You rated ${brand} as ${type === "stash" ? "💰 Stash" : "🚮 Trash"}`);
};

// Profile Section
window.showProfile = () => {
  profileSection.classList.toggle("hidden");
};

window.saveProfile = async () => {
  const address = document.getElementById("profile-address").value;
  const phone = document.getElementById("profile-phone").value;
  const photo = document.getElementById("profile-photo").files[0];
  const uid = auth.currentUser.uid;

  const updates = { address, phone };

  if (photo) {
    const storageRef = ref(storage, `profile_photos/${uid}`);
    await uploadBytes(storageRef, photo);
    const photoURL = await getDownloadURL(storageRef);
    updates.photoURL = photoURL;
    document.getElementById("profile-preview").innerHTML = `<img src="${photoURL}" width="100" />`;
  }

  await updateDoc(doc(db, "users", uid), updates);
  alert("Profile updated!");
};

async function loadProfile() {
  const uid = auth.currentUser.uid;
  const docSnap = await getDoc(doc(db, "users", uid));

  if (docSnap.exists()) {
    const data = docSnap.data();
    document.getElementById("profile-address").value = data.address || "";
    document.getElementById("profile-phone").value = data.phone || "";
    if (data.photoURL) {
      document.getElementById("profile-preview").innerHTML = `<img src="${data.photoURL}" width="100" />`;
    }
  }
}
