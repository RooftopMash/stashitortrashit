import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import {
  getFirestore, doc, setDoc, getDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import {
  getStorage, ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";

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
const db = getFirestore();
const storage = getStorage();

const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const welcomeScreen = document.getElementById("welcome-screen");
const mainContent = document.getElementById("main-content");
const brandSelect = document.getElementById("brand");

const topBrands = [
  "Apple", "Amazon", "Google", "Microsoft", "Samsung", "Toyota", "Coca-Cola", "Nike",
  "Mercedes-Benz", "McDonald's", "Tesla", "Netflix", "Visa", "Adidas", "Intel", "Facebook",
  "Sony", "Starbucks", "Pepsi", "BMW", "Nestlé", "Huawei", "Zara", "YouTube", "Gucci",
  "Colgate", "Unilever", "IKEA", "TikTok", "Ford", "KFC", "Shell", "Canon", "LinkedIn"
];

window.updateBrandList = () => {
  brandSelect.innerHTML = "<option value=''>--Select Brand--</option>";
  topBrands.forEach(brand => {
    const option = document.createElement("option");
    option.value = brand;
    option.textContent = brand;
    brandSelect.appendChild(option);
  });
};
updateBrandList();

document.getElementById("show-signup").onclick = () => {
  signupForm.style.display = "block";
  loginForm.style.display = "none";
};
document.getElementById("show-login").onclick = () => {
  signupForm.style.display = "none";
  loginForm.style.display = "block";
};

document.getElementById("signup-btn").onclick = async () => {
  const name = document.getElementById("signup-name").value;
  const country = document.getElementById("country").value;
  const address = document.getElementById("address").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", userCred.user.uid), {
      name, country, address, phone, email
    });
    welcomeScreen.style.display = "block";
    signupForm.style.display = "none";
  } catch (err) {
    alert("Signup Error: " + err.message);
  }
};

document.getElementById("login-btn").onclick = async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    welcomeScreen.style.display = "block";
    loginForm.style.display = "none";
  } catch (err) {
    alert("Login Error: " + err.message);
  }
};

document.getElementById("continue-btn").onclick = () => {
  welcomeScreen.style.display = "none";
  mainContent.style.display = "block";
};

document.getElementById("logout").onclick = () => signOut(auth);
document.getElementById("profile-btn").onclick = () => {
  mainContent.style.display = "none";
  showUserProfile();
};

async function showUserProfile() {
  const user = auth.currentUser;
  if (!user) return;

  const docSnap = await getDoc(doc(db, "users", user.uid));
  if (docSnap.exists()) {
    const data = docSnap.data();
    document.getElementById("profile-section").style.display = "block";
    document.getElementById("edit-country").value = data.country || "";
    document.getElementById("edit-address").value = data.address || "";
    document.getElementById("edit-phone").value = data.phone || "";
    document.getElementById("profile-pic-preview").src = data.profilePicURL || "";
  }
}

document.getElementById("save-profile").onclick = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const country = document.getElementById("edit-country").value;
  const address = document.getElementById("edit-address").value;
  const phone = document.getElementById("edit-phone").value;
  const file = document.getElementById("profile-pic-upload").files[0];

  let profilePicURL = "";

  if (file && file.size <= 5 * 1024 * 1024) {
    const storageRef = ref(storage, `profilePics/${user.uid}`);
    await uploadBytes(storageRef, file);
    profilePicURL = await getDownloadURL(storageRef);
  }

  await updateDoc(doc(db, "users", user.uid), {
    country, address, phone, profilePicURL
  });

  alert("Profile updated!");
  document.getElementById("profile-section").style.display = "none";
  mainContent.style.display = "block";
};

document.querySelectorAll(".emoji-btn").forEach(button => {
  button.onclick = () => {
    const brand = brandSelect.value;
    const product = document.getElementById("product-name").value.trim();
    const rating = button.dataset.rating;
    if (!brand || !product) {
      alert("Please select brand and enter product name.");
      return;
    }
    alert(`${rating === "stash" ? "💰 Stashed" : "🚮 Trashed"} ${product} from ${brand}`);
  };
});

onAuthStateChanged(auth, user => {
  if (user) {
    document.getElementById("auth-section").style.display = "none";
    welcomeScreen.style.display = "block";
  }
});
