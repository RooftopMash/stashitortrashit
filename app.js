// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBu1iRSWC3l7VGJvHyD49xXqqGdEIa9Kis",
  authDomain: "stashortrash-acbbf.firebaseapp.com",
  projectId: "stashortrash-acbbf",
  storageBucket: "stashortrash-acbbf.appspot.com",
  messagingSenderId: "782905521538",
  appId: "1:782905521538:web:856d1e7789edd76882cb9b",
  measurementId: "G-8Y4ZXJTPM6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Login Function
document.getElementById("userLoginBtn").onclick = async () => {
  const email = document.getElementById("userLoginEmail").value;
  const password = document.getElementById("userLoginPassword").value;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (error) {
    alert("Login failed: " + error.message);
  }
};

// Save Profile
document.getElementById("saveProfileBtn")?.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in to save profile.");
    return;
  }

  const profilePhoto = document.getElementById("profilePhoto").files[0];
  const name = document.getElementById("profileName").value;
  const country = document.getElementById("profileCountry").value;
  const phone = document.getElementById("profilePhone").value;

  try {
    let profilePhotoUrl = "";
    if (profilePhoto) {
      const storageRef = ref(storage, `profilePhotos/${user.uid}`);
      await uploadBytes(storageRef, profilePhoto);
      profilePhotoUrl = await getDownloadURL(storageRef);
    }

    await setDoc(doc(db, "users", user.uid), {
      name,
      country,
      phone,
      profilePhotoUrl
    });

    alert("Profile saved successfully.");
    window.location.href = "dashboard.html";
  } catch (error) {
    alert("Failed to save profile: " + error.message);
  }
});

// Load Profile for Editing
async function loadProfile() {
  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in to access profile.");
    window.location.href = "index.html";
    return;
  }

  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    document.getElementById("profileName").value = data.name || "";
    document.getElementById("profileCountry").value = data.country || "";
    document.getElementById("profilePhone").value = data.phone || "";
    if (data.profilePhotoUrl) {
      document.getElementById("profileImagePreview").src = data.profilePhotoUrl;
      document.getElementById("profileImagePreview").style.display = "block";
    }
  }
}

// Automatically Load Profile if on Profile Page
if (window.location.pathname.includes("profile.html")) {
  loadProfile();
}

// Logout Function
function logout() {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
}
