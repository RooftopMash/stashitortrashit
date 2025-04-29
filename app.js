// Firebase v9 SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBu1iRSWC3l7VGJvHyD49xXqqGdEIa9Kis",
  authDomain: "stashortrash-acbbf.firebaseapp.com",
  projectId: "stashortrash-acbbf",
  storageBucket: "stashortrash-acbbf.appspot.com",
  messagingSenderId: "782905521538",
  appId: "1:782905521538:web:856d1e7789edd76882cb9b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Elements
const loginSection = document.getElementById("login-section");
const signupSection = document.getElementById("signup-section");
const mainContent = document.getElementById("main-content");
const welcomeScreen = document.getElementById("welcome-screen");
const profileSection = document.getElementById("profile-section");

// Sample international brands
const topBrands = [
  "Coca-Cola", "Pepsi", "Nike", "Adidas", "Apple", "Samsung", "Sony", "Toyota",
  "Ford", "Nestlé", "Unilever", "McDonald's", "KFC", "Zara", "H&M",
  "Shoprite Checkers", "Pick n Pay", "Game", "Dis-Chem", "Woolworths"
];

// Update brand dropdown
window.updateBrandList = () => {
  const brandSelect = document.getElementById("brand-select");
  brandSelect.innerHTML = "<option value=''>--Select Brand--</option>";
  topBrands.forEach(brand => {
    const option = document.createElement("option");
    option.value = brand;
    option.textContent = brand;
    brandSelect.appendChild(option);
  });
};
updateBrandList();

// Signup
document.getElementById("signup-btn").addEventListener("click", async () => {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const country = document.getElementById("signup-country").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", userCredential.user.uid), {
      country,
      address: "",
      phone: "",
      profilePicURL: ""
    });
    alert("Signup successful!");
    signupSection.style.display = "none";
    welcomeScreen.style.display = "block";
  } catch (error) {
    alert("Signup failed: " + error.message);
  }
});

// Login
document.getElementById("login-btn").addEventListener("click", async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    loginSection.style.display = "none";
    welcomeScreen.style.display = "block";
  } catch (error) {
    alert("Login failed: " + error.message);
  }
});

// Logout
document.getElementById("logout-btn").addEventListener("click", async () => {
  await signOut(auth);
  location.reload();
});

// Show profile
document.getElementById("view-profile-btn").addEventListener("click", showUserProfile);

// Save profile
document.getElementById("save-profile-btn").addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const country = document.getElementById("edit-country").value;
  const address = document.getElementById("edit-address").value;
  const phone = document.getElementById("edit-phone").value;
  const profilePicFile = document.getElementById("profile-pic").files[0];

  const userDocRef = doc(db, "users", user.uid);
  const updates = { country, address, phone };

  try {
    if (profilePicFile) {
      const storageRef = ref(storage, `profile_pics/${user.uid}`);
      await uploadBytes(storageRef, profilePicFile);
      const downloadURL = await getDownloadURL(storageRef);
      updates.profilePicURL = downloadURL;
    }
    await setDoc(userDocRef, updates, { merge: true });
    alert("Profile updated!");
    showUserProfile();
  } catch (error) {
    alert("Profile update failed: " + error.message);
  }
});

// Show user profile details
async function showUserProfile() {
  const user = auth.currentUser;
  if (!user) return;

  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();

    document.getElementById("edit-country").value = data.country || "";
    document.getElementById("edit-address").value = data.address || "";
    document.getElementById("edit-phone").value = data.phone || "";
    document.getElementById("profile-pic-preview").src = data.profilePicURL || "";

    profileSection.style.display = "block";
    mainContent.style.display = "none";
    welcomeScreen.style.display = "none";
  } else {
    // Legacy fix for missing user doc
    await setDoc(docRef, { country: "", address: "", phone: "", profilePicURL: "" });
    showUserProfile();
  }
}

// Auth state check
onAuthStateChanged(auth, user => {
  if (user) {
    loginSection.style.display = "none";
    signupSection.style.display = "none";
    welcomeScreen.style.display = "block";
  } else {
    loginSection.style.display = "block";
    signupSection.style.display = "none";
    welcomeScreen.style.display = "none";
    mainContent.style.display = "none";
    profileSection.style.display = "none";
  }
});
