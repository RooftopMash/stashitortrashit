// Import Firebase SDK
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js';

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBu1iRSWC3l7VGJvHyD49xXqqGdEIa9Kis",
  authDomain: "stashortrash-acbbf.firebaseapp.com",
  projectId: "stashortrash-acbbf",
  storageBucket: "stashortrash-acbbf.appspot.com",
  messagingSenderId: "782905521538",
  appId: "1:782905521538:web:856d1e7789edd76882cb9b",
  measurementId: "G-8Y4ZXJTPM6"
};

// Init Services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Elements
const userSignupBtn = document.getElementById('userSignupBtn');
const userLoginBtn = document.getElementById('userLoginBtn');
const brandSignupBtn = document.getElementById('brandSignupBtn');
const brandLoginBtn = document.getElementById('brandLoginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const profileSection = document.getElementById('profileSection');
const logoInput = document.getElementById('logoInput');

// Register Handlers
if (userSignupBtn) {
  userSignupBtn.addEventListener('click', () => handleSignup('user'));
}
if (brandSignupBtn) {
  brandSignupBtn.addEventListener('click', () => handleSignup('brand'));
}
if (userLoginBtn) {
  userLoginBtn.addEventListener('click', () => handleLogin('user'));
}
if (brandLoginBtn) {
  brandLoginBtn.addEventListener('click', () => handleLogin('brand'));
}
if (logoutBtn) {
  logoutBtn.addEventListener('click', handleLogout);
}

// Handle Signup
async function handleSignup(type) {
  const email = document.getElementById(`${type}Email`).value.trim();
  const password = document.getElementById(`${type}Password`).value;
  const name = document.getElementById(`${type}Name`).value;
  const phone = document.getElementById(`${type}Phone`).value;
  const country = document.getElementById(`${type}Country`).value;
  const social = document.getElementById(`${type}Social`).value;

  if (!validateEmail(email) || password.length < 6) {
    alert("Enter a valid email and password with at least 6 characters.");
    return;
  }

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCred.user.uid;

    // Upload logo if brand
    let logoURL = '';
    if (type === 'brand' && logoInput && logoInput.files[0]) {
      const file = logoInput.files[0];
      const storageRef = ref(storage, `logos/${uid}`);
      await uploadBytes(storageRef, file);
      logoURL = await getDownloadURL(storageRef);
    }

    await setDoc(doc(db, type + 's', uid), {
      uid,
      email,
      name,
      phone,
      country,
      social,
      logo: logoURL,
      type,
      createdAt: new Date().toISOString()
    });

    alert("Signup successful. You can now log in.");
  } catch (err) {
    alert(err.message);
    console.error(err);
  }
}

// Handle Login
async function handleLogin(type) {
  const email = document.getElementById(`${type}Email`).value.trim();
  const password = document.getElementById(`${type}Password`).value;

  if (!validateEmail(email) || password.length < 6) {
    alert("Invalid login credentials.");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    alert(err.message);
    console.error(err);
  }
}

// Handle Logout
async function handleLogout() {
  try {
    await signOut(auth);
    window.location.reload();
  } catch (err) {
    alert(err.message);
  }
}

// Load Profile
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;
    const userDoc = await getDoc(doc(db, 'users', uid));
    const brandDoc = await getDoc(doc(db, 'brands', uid));
    const profile = userDoc.exists() ? userDoc.data() : brandDoc.data();
    if (profile) {
      populateProfile(profile);
    }
  }
});

// Display Profile
function populateProfile(data) {
  if (!profileSection) return;
  profileSection.innerHTML = `
    <h3>Welcome, ${data.name}</h3>
    <input type="text" id="editName" value="${data.name}" />
    <input type="email" id="editEmail" value="${data.email}" />
    <input type="tel" id="editPhone" value="${data.phone}" />
    <input type="text" id="editCountry" value="${data.country}" />
    <input type="url" id="editSocial" value="${data.social}" />
    <input type="file" id="editLogo" />
    <button onclick="updateProfile('${data.uid}', '${data.type}')">Save Changes</button>
  `;
}

// Update Profile
window.updateProfile = async (uid, type) => {
  const name = document.getElementById('editName').value;
  const email = document.getElementById('editEmail').value;
  const phone = document.getElementById('editPhone').value;
  const country = document.getElementById('editCountry').value;
  const social = document.getElementById('editSocial').value;
  const logoFile = document.getElementById('editLogo').files[0];

  try {
    let logoURL = '';
    if (logoFile) {
      const logoRef = ref(storage, `logos/${uid}`);
      await uploadBytes(logoRef, logoFile);
      logoURL = await getDownloadURL(logoRef);
    }

    await updateDoc(doc(db, type + 's', uid), {
      name,
      email,
      phone,
      country,
      social,
      ...(logoURL && { logo: logoURL })
    });

    alert('Profile updated!');
  } catch (err) {
    alert('Error updating profile.');
    console.error(err);
  }
};

// Validators
function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}
