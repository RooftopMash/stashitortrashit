// Import Firebase modules
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MSG_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// DOM Elements
const loginScreen = document.getElementById("loginScreen");
const signupScreen = document.getElementById("signupScreen");
const welcomeScreen = document.getElementById("welcomeScreen");
const appScreen = document.getElementById("appScreen");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginBtn = document.getElementById("loginBtn");
const goToSignup = document.getElementById("goToSignup");

const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");
const signupCountry = document.getElementById("signupCountry");
const signupBtn = document.getElementById("signupBtn");
const goToLogin = document.getElementById("goToLogin");

const continueBtn = document.getElementById("continueBtn");

const logoutBtn = document.getElementById("logoutBtn");

const profilePicPreview = document.getElementById("profilePicPreview");
const profilePicInput = document.getElementById("profilePicInput");
const userCountry = document.getElementById("userCountry");
const userPhone = document.getElementById("userPhone");
const userAddress = document.getElementById("userAddress");
const updateProfileBtn = document.getElementById("updateProfileBtn");

const brandDropdown = document.getElementById("brandDropdown");
const ratingButtons = document.getElementById("ratingButtons");

// Navigation Functions
goToSignup.addEventListener("click", () => {
  loginScreen.classList.add("hidden");
  signupScreen.classList.remove("hidden");
});

goToLogin.addEventListener("click", () => {
  signupScreen.classList.add("hidden");
  loginScreen.classList.remove("hidden");
});

// Signup Function
signupBtn.addEventListener("click", async () => {
  const email = signupEmail.value;
  const password = signupPassword.value;
  const country = signupCountry.value;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Create user profile in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: email,
      country: country,
      phone: "",
      address: "",
      photoURL: "",
    });

    signupScreen.classList.add("hidden");
    welcomeScreen.classList.remove("hidden");
  } catch (error) {
    console.error("Signup Error:", error);
    alert("Error during signup: " + error.message);
  }
});

// Login Function
loginBtn.addEventListener("click", async () => {
  const email = loginEmail.value;
  const password = loginPassword.value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    loginScreen.classList.add("hidden");
    welcomeScreen.classList.remove("hidden");
  } catch (error) {
    console.error("Login Error:", error);
    alert("Error during login: " + error.message);
  }
});

// Continue to App
continueBtn.addEventListener("click", () => {
  welcomeScreen.classList.add("hidden");
  appScreen.classList.remove("hidden");
});

// Logout Function
logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    appScreen.classList.add("hidden");
    loginScreen.classList.remove("hidden");
  } catch (error) {
    console.error("Logout Error:", error);
    alert("Error during logout: " + error.message);
  }
});

// Load User Profile
const loadUserProfile = async (user) => {
  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      userCountry.value = data.country || "";
      userPhone.value = data.phone || "";
      userAddress.value = data.address || "";
      if (data.photoURL) {
        profilePicPreview.src = data.photoURL;
      } else {
        profilePicPreview.src = "default-profile.png";
      }
    }
  } catch (error) {
    console.error("Load Profile Error:", error);
  }
};

// Update Profile
updateProfileBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const country = userCountry.value;
  const phone = userPhone.value;
  const address = userAddress.value;
  let photoURL = profilePicPreview.src;

  try {
    // Upload new profile picture if selected
    if (profilePicInput.files.length > 0) {
      const file = profilePicInput.files[0];
      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      await uploadBytes(storageRef, file);
      photoURL = await getDownloadURL(storageRef);
      profilePicPreview.src = photoURL;
    }

    // Update user document
    await updateDoc(doc(db, "users", user.uid), {
      country: country,
      phone: phone,
      address: address,
      photoURL: photoURL,
    });

    alert("Profile updated successfully.");
  } catch (error) {
    console.error("Update Profile Error:", error);
    alert("Error updating profile: " + error.message);
  }
});

// Load Brands
const loadBrands = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "brands"));
    brandDropdown.innerHTML =
      '<option value="">Select a brand...</option>';
    querySnapshot.forEach((doc) => {
      const brand = doc.data();
      const option = document.createElement("option");
      option.value = doc.id;
      option.textContent = brand.name;
      brandDropdown.appendChild(option);
    });
  } catch (error) {
    console.error("Load Brands Error:", error);
  }
};

// Handle Brand Selection
brandDropdown.addEventListener("change", () => {
  if (brandDropdown.value) {
    ratingButtons.classList.remove("hidden");
  } else {
    ratingButtons.classList.add("hidden");
  }
});

// Handle Rating
ratingButtons.addEventListener("click", async (e) => {
  if (e.target.tagName !== "BUTTON") return;

  const rating = e.target.dataset.rating;
  const brandId = brandDropdown.value;
  const user = auth.currentUser;

  if (!brandId || !user) return;

  try {
    await setDoc(doc(db, "ratings", `${user.uid}_${brandId}`), {
      userId: user.uid,
      brandId: brandId,
      rating: rating,
      timestamp: new Date(),
    });

    alert(`You rated the brand as "${rating.toUpperCase()}".`);
  } catch (error) {
    console.error("Rating Error:", error);
    alert("Error submitting rating: " + error.message);
  }
});

// Auth State Listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadUserProfile(user);
    loadBrands();
    loginScreen.classList.add("hidden");
    signupScreen.classList.add("hidden");
    welcomeScreen.classList.remove("hidden");
  } else {
    loginScreen.classList.remove("hidden");
    signupScreen.classList.add("hidden");
    welcomeScreen.classList.add("hidden");
    appScreen.classList.add("hidden");
  }
});
