import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-storage.js";

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
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);

document.getElementById("loginBtn").addEventListener("click", loginUser);
document.getElementById("signupBtn").addEventListener("click", signupUser);
document.getElementById("logoutBtn").addEventListener("click", logoutUser);
document.getElementById("goToAppBtn").addEventListener("click", goToApp);

document.getElementById("saveProfileBtn").addEventListener("click", saveProfile);
document.getElementById("profilePicUpload").addEventListener("change", handleProfilePicUpload);

let currentUser = null;

// Load Brands from Firestore
async function loadBrands() {
  const brandsRef = collection(db, "brands");
  const querySnapshot = await getDocs(brandsRef);
  const brandDropdown = document.getElementById("brandDropdown");

  querySnapshot.forEach((doc) => {
    const option = document.createElement("option");
    option.value = doc.id;
    option.textContent = doc.data().name;
    brandDropdown.appendChild(option);
  });
}

// Sign up user
async function signupUser() {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    document.getElementById("signupScreen").classList.add("hidden");
    document.getElementById("welcomeScreen").classList.remove("hidden");
  } catch (error) {
    alert(error.message);
  }
}

// Log in user
async function loginUser() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("welcomeScreen").classList.remove("hidden");
  } catch (error) {
    alert(error.message);
  }
}

// Log out user
function logoutUser() {
  signOut(auth).then(() => {
    document.getElementById("appScreen").classList.add("hidden");
    document.getElementById("loginScreen").classList.remove("hidden");
  }).catch((error) => {
    alert(error.message);
  });
}

// Go to App
function goToApp() {
  document.getElementById("welcomeScreen").classList.add("hidden");
  document.getElementById("appScreen").classList.remove("hidden");
  loadBrands();
}

// Save profile
async function saveProfile() {
  const profilePic = document.getElementById("profilePicPreview").src;
  const country = document.getElementById("profileCountry").value;

  if (currentUser) {
    await setDoc(doc(db, "users", currentUser.uid), {
      profilePic,
      country
    });
    alert("Profile saved!");
  } else {
    alert("Please log in first.");
  }
}

// Handle Profile Pic Upload
async function handleProfilePicUpload(event) {
  const file = event.target.files[0];
  const storageRef = ref(storage, `profilePics/${file.name}`);
  
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  document.getElementById("profilePicPreview").src = downloadURL;
}
