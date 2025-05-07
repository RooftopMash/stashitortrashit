// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";

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

document.getElementById("userLoginBtn").onclick = async () => {
  const email = document.getElementById("userLoginEmail").value;
  const password = document.getElementById("userLoginPassword").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (error) {
    alert(error.message);
  }
};

document.getElementById("userSignupBtn").onclick = async () => {
  const email = document.getElementById("userSignupEmail").value;
  const password = document.getElementById("userSignupPassword").value;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (error) {
    alert(error.message);
  }
};

document.getElementById("saveProfileBtn").onclick = async () => {
  const profilePhoto = document.getElementById("profilePhoto").files[0];
  const country = document.getElementById("profileCountry").value;
  const address = document.getElementById("profileAddress").value;
  const phone = document.getElementById("profilePhone").value;
  try {
    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, "users", user.uid), { country, address, phone });
      alert("Profile updated!");
    }
  } catch (error) {
    alert(error.message);
  }
};

window.logout = () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  }).catch((error) => {
    alert(error.message);
  });
};
