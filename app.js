// Import Firebase modules (must be used with <script type="module"> in HTML)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBu1iRSWC3l7VGJvHyD49xXqqGdEIa9Kis",
  authDomain: "stashortrash-acbbf.firebaseapp.com",
  projectId: "stashortrash-acbbf",
  storageBucket: "stashortrash-acbbf.appspot.com", // corrected domain
  messagingSenderId: "782905521538",
  appId: "1:782905521538:web:856d1e7789edd76882cb9b",
  measurementId: "G-8Y4ZXJTPM6"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ USER SIGNUP
document.getElementById("userSignupBtn").addEventListener("click", async () => {
  const email = document.getElementById("userSignupEmail").value;
  const password = document.getElementById("userSignupPassword").value;
  const country = document.getElementById("userCountryDropdown").value;
  const phone = document.getElementById("userPhone").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    await setDoc(doc(db, "users", uid), {
      email,
      country,
      phone,
      role: "user"
    });
    alert("User signed up successfully!");
  } catch (error) {
    alert("Signup failed: " + error.message);
  }
});

// ✅ USER LOGIN
document.getElementById("userLoginBtn").addEventListener("click", async () => {
  const email = document.getElementById("userLoginEmail").value;
  const password = document.getElementById("userLoginPassword").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("User logged in successfully!");
    // Redirect or show homepage logic here
  } catch (error) {
    alert("Login failed: " + error.message);
  }
});

// ✅ BRAND SIGNUP
document.getElementById("brandSignupBtn").addEventListener("click", async () => {
  const email = document.getElementById("brandSignupEmail").value;
  const password = document.getElementById("brandSignupPassword").value;
  const brandName = document.getElementById("brandName").value;
  const country = document.getElementById("brandCountryDropdown").value;
  const phone = document.getElementById("brandPhone").value;
  const website = document.getElementById("brandWebsite").value;
  const logoFile = document.getElementById("brandLogo").files[0];

  try {
    const brandCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = brandCredential.user.uid;

    let logoURL = "";
    if (logoFile) {
      const storageRef = ref(storage, `brandLogos/${uid}/${logoFile.name}`);
      await uploadBytes(storageRef, logoFile);
      logoURL = await getDownloadURL(storageRef);
    }

    await setDoc(doc(db, "brands", uid), {
      email,
      brandName,
      country,
      phone,
      website,
      logoURL,
      role: "brand"
    });

    alert("Brand registered successfully!");
  } catch (error) {
    alert("Brand signup failed: " + error.message);
  }
});

// ✅ BRAND LOGIN
document.getElementById("brandLoginBtn").addEventListener("click", async () => {
  const email = document.getElementById("brandLoginEmail").value;
  const password = document.getElementById("brandLoginPassword").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Brand logged in successfully!");
    // Redirect or show brand dashboard here
  } catch (error) {
    alert("Brand login failed: " + error.message);
  }
});

// ✅ Enable ENTER key to trigger login
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const userForm = document.getElementById("userForm").style.display !== "none";
    const brandForm = document.getElementById("brandForm").style.display !== "none";

    if (userForm) {
      document.getElementById("userLoginBtn").click();
    } else if (brandForm) {
      document.getElementById("brandLoginBtn").click();
    }
  }
});
