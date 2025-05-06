// App.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

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
const storage = getStorage(app);

// Show/Hide form sections
window.showUserForm = () => {
  document.getElementById("userForm").style.display = "block";
  document.getElementById("brandForm").style.display = "none";
};

window.showBrandForm = () => {
  document.getElementById("brandForm").style.display = "block";
  document.getElementById("userForm").style.display = "none";
};

window.toggleUserSignup = () => {
  const signup = document.getElementById("userSignup");
  signup.style.display = signup.style.display === "none" ? "block" : "none";
};

window.toggleBrandSignup = () => {
  const signup = document.getElementById("brandSignup");
  signup.style.display = signup.style.display === "none" ? "block" : "none";
};

// User Sign Up
document.getElementById("userSignupBtn").addEventListener("click", async () => {
  const email = document.getElementById("userSignupEmail").value;
  const password = document.getElementById("userSignupPassword").value;
  const country = document.getElementById("userCountryDropdown").value;
  const phone = document.getElementById("userPhone").value;

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    await setDoc(doc(db, "users", user.uid), {
      type: "user",
      email,
      country,
      phone
    });

    window.location.href = "dashboard.html";
  } catch (error) {
    alert("User Signup Failed: " + error.message);
  }
});

// User Login
document.getElementById("userLoginBtn").addEventListener("click", async () => {
  const email = document.getElementById("userLoginEmail").value;
  const password = document.getElementById("userLoginPassword").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (error) {
    alert("User Login Failed: " + error.message);
  }
});

// Brand Sign Up
document.getElementById("brandSignupBtn").addEventListener("click", async () => {
  const email = document.getElementById("brandSignupEmail").value;
  const password = document.getElementById("brandSignupPassword").value;
  const name = document.getElementById("brandName").value;
  const country = document.getElementById("brandCountryDropdown").value;
  const phone = document.getElementById("brandPhone").value;
  const website = document.getElementById("brandWebsite").value;
  const logoFile = document.getElementById("brandLogo").files[0];

  try {
    const brandCred = await createUserWithEmailAndPassword(auth, email, password);
    const brand = brandCred.user;

    const logoRef = ref(storage, `brandLogos/${brand.uid}`);
    await uploadBytes(logoRef, logoFile);

    await setDoc(doc(db, "brands", brand.uid), {
      type: "brand",
      email,
      name,
      country,
      phone,
      website,
      logoPath: logoRef.fullPath
    });

    window.location.href = "dashboard.html";
  } catch (error) {
    alert("Brand Signup Failed: " + error.message);
  }
});

// Brand Login
document.getElementById("brandLoginBtn").addEventListener("click", async () => {
  const email = document.getElementById("brandLoginEmail").value;
  const password = document.getElementById("brandLoginPassword").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (error) {
    alert("Brand Login Failed: " + error.message);
  }
});

// Optional: Redirect if already logged in
onAuthStateChanged(auth, (user) => {
  // Uncomment this if you want auto-redirect
  // if (user) window.location.href = "dashboard.html";
});
