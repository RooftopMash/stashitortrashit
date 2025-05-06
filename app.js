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
  storageBucket: "stashortrash-acbbf.appspot.com",
  messagingSenderId: "782905521538",
  appId: "1:782905521538:web:856d1e7789edd76882cb9b",
  measurementId: "G-8Y4ZXJTPM6"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ Helper: Disable/Enable Button
function toggleButton(buttonId, isDisabled) {
  const btn = document.getElementById(buttonId);
  if (btn) {
    btn.disabled = isDisabled;
    btn.innerText = isDisabled ? "Please wait..." : btn.dataset.originalText || btn.innerText;
    if (!btn.dataset.originalText) btn.dataset.originalText = btn.innerText;
  }
}

// ✅ USER SIGNUP
document.getElementById("userSignupBtn").addEventListener("click", async () => {
  const email = document.getElementById("userSignupEmail").value.trim();
  const password = document.getElementById("userSignupPassword").value.trim();
  const country = document.getElementById("userCountryDropdown").value;
  const phone = document.getElementById("userPhone").value.trim();

  if (!email || !password || !country || !phone) {
    alert("Please fill out all required fields.");
    return;
  }

  toggleButton("userSignupBtn", true);
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
    window.location.href = "welcome.html";
  } catch (error) {
    alert("Signup failed: " + error.message);
  }
  toggleButton("userSignupBtn", false);
});

// ✅ USER LOGIN
document.getElementById("userLoginBtn").addEventListener("click", async () => {
  const email = document.getElementById("userLoginEmail").value.trim();
  const password = document.getElementById("userLoginPassword").value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  toggleButton("userLoginBtn", true);
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("User logged in successfully!");
    window.location.href = "welcome.html";
  } catch (error) {
    alert("Login failed: " + error.message);
  }
  toggleButton("userLoginBtn", false);
});

// ✅ BRAND SIGNUP
document.getElementById("brandSignupBtn").addEventListener("click", async () => {
  const email = document.getElementById("brandSignupEmail").value.trim();
  const password = document.getElementById("brandSignupPassword").value.trim();
  const brandName = document.getElementById("brandName").value.trim();
  const country = document.getElementById("brandCountryDropdown").value;
  const phone = document.getElementById("brandPhone").value.trim();
  const website = document.getElementById("brandWebsite").value.trim();
  const logoFile = document.getElementById("brandLogo").files[0];

  if (!email || !password || !brandName || !country || !phone || !website) {
    alert("Please fill out all required fields.");
    return;
  }

  if (logoFile && logoFile.size > 5 * 1024 * 1024) {
    alert("Logo file must be under 5MB.");
    return;
  }

  toggleButton("brandSignupBtn", true);
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
    window.location.href = "welcome.html";
  } catch (error) {
    alert("Brand signup failed: " + error.message);
  }
  toggleButton("brandSignupBtn", false);
});

// ✅ BRAND LOGIN
document.getElementById("brandLoginBtn").addEventListener("click", async () => {
  const email = document.getElementById("brandLoginEmail").value.trim();
  const password = document.getElementById("brandLoginPassword").value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  toggleButton("brandLoginBtn", true);
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Brand logged in successfully!");
    window.location.href = "welcome.html";
  } catch (error) {
    alert("Brand login failed: " + error.message);
  }
  toggleButton("brandLoginBtn", false);
});

// ✅ ENTER key login shortcut
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const userForm = document.getElementById("userForm")?.style.display !== "none";
    const brandForm = document.getElementById("brandForm")?.style.display !== "none";

    if (userForm) {
      document.getElementById("userLoginBtn").click();
    } else if (brandForm) {
      document.getElementById("brandLoginBtn").click();
    }
  }
});
