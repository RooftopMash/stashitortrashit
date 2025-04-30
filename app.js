// App.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";

// Firebase config
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

const brandListContainer = document.getElementById("brandList");
const logoutBtn = document.getElementById("logoutBtn");
const profilePhotoInput = document.getElementById("profilePhotoInput");
const saveProfileBtn = document.getElementById("saveProfileBtn");
const countryDisplay = document.getElementById("countryDisplay");

// Load brands from Firestore dynamically
async function loadBrands(userCountry = null) {
  brandListContainer.innerHTML = "";
  const brandRef = collection(db, "brands");
  const q = userCountry
    ? query(brandRef, where("country", "==", userCountry))
    : brandRef;

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const brandName = doc.data().name;
    const div = document.createElement("div");
    div.className = "brand-entry";
    div.innerHTML = `
      <strong>${brandName}</strong>
      <button class="rateBtn" data-brand="${brandName}" data-rating="stash">💰</button>
      <button class="rateBtn" data-brand="${brandName}" data-rating="trash">🚮</button>
    `;
    brandListContainer.appendChild(div);
  });

  attachRatingListeners();
}

function attachRatingListeners() {
  document.querySelectorAll(".rateBtn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const brand = e.target.getAttribute("data-brand");
      const rating = e.target.getAttribute("data-rating");
      const user = auth.currentUser;
      if (!user) return alert("Please log in to rate.");
      await addDoc(collection(db, "ratings"), {
        brand,
        rating,
        userId: user.uid,
        timestamp: new Date()
      });
      alert(`Rated ${brand} as ${rating.toUpperCase()}`);
    });
  });
}

// Handle profile upload
if (saveProfileBtn) {
  saveProfileBtn.addEventListener("click", async () => {
    const file = profilePhotoInput.files[0];
    if (!file || file.size > 5 * 1024 * 1024) {
      return alert("Please select a valid image under 5MB.");
    }
    const user = auth.currentUser;
    if (!user) return;
    const storageRef = ref(storage, `profiles/${user.uid}/photo.jpg`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    document.getElementById("profilePic").src = downloadURL;
    alert("Profile photo updated.");
  });
}

// Auth state
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("authSection").style.display = "none";
    document.getElementById("appSection").style.display = "block";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    loadBrands(); // You can replace with loadBrands('South Africa') if using country targeting
  } else {
    document.getElementById("authSection").style.display = "block";
    document.getElementById("appSection").style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "none";
  }
});

// Logout
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
      window.location.reload();
    });
  });
}
