// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBu1iRSWC3l7VGJvHyD49xXqqGdEIa9Kis",
  authDomain: "stashortrash-acbbf.firebaseapp.com",
  projectId: "stashortrash-acbbf",
  storageBucket: "stashortrash-acbbf.appspot.com",
  messagingSenderId: "782905521538",
  appId: "1:782905521538:web:856d1e7789edd76882cb9b",
  measurementId: "G-8Y4ZXJTPM6"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// LOGIN
document.getElementById("userLoginBtn").addEventListener("click", async () => {
  const email = document.getElementById("userLoginEmail").value;
  const password = document.getElementById("userLoginPassword").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (error) {
    alert("Login failed: " + error.message);
  }
});

// SIGN UP
document.getElementById("userSignupBtn").addEventListener("click", async () => {
  const email = document.getElementById("userSignupEmail").value;
  const password = document.getElementById("userSignupPassword").value;
  const country = document.getElementById("userCountryDropdown").value;
  const phone = document.getElementById("userPhone").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      email,
      country,
      phone,
      profilePhoto: ""
    });

    window.location.href = "dashboard.html";
  } catch (error) {
    alert("Signup failed: " + error.message);
  }
});

// LOGOUT (used in dashboard.html)
export function logout() {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  }).catch((error) => {
    alert("Logout failed: " + error.message);
  });
}

// PROFILE UPDATE
async function updateProfilePhoto(file) {
  const user = auth.currentUser;
  const fileRef = ref(storage, `profile_photos/${user.uid}`);
  await uploadBytes(fileRef, file);
  const downloadURL = await getDownloadURL(fileRef);

  await updateDoc(doc(db, "users", user.uid), {
    profilePhoto: downloadURL
  });

  document.getElementById("profilePhotoPreview").src = downloadURL;
}

// Attach profile photo change event
document.getElementById("profilePhotoInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  updateProfilePhoto(file);
});
