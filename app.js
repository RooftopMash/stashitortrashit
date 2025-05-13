import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";

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

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

// Show/hide forms
function showUserForm() {
  document.getElementById('userForm').classList.remove('hidden');
  document.getElementById('brandForm').classList.add('hidden');
}

function showBrandForm() {
  document.getElementById('brandForm').classList.remove('hidden');
  document.getElementById('userForm').classList.add('hidden');
}

// User login
document.getElementById('userLoginBtn').addEventListener('click', async () => {
  const email = document.getElementById('userLoginEmail').value;
  const password = document.getElementById('userLoginPassword').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('Logged in as:', user.email);
  } catch (error) {
    console.error("Error logging in: ", error.message);
  }
});

// User signup
document.getElementById('userSignupBtn').addEventListener('click', async () => {
  const email = document.getElementById('userSignupEmail').value;
  const password = document.getElementById('userSignupPassword').value;
  const phone = document.getElementById('userPhone').value;
  const country = document.getElementById('userCountryDropdown').value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('Signed up as:', user.email);

    await setDoc(doc(db, "users", user.uid), {
      email,
      phone,
      country
    });

    alert('User registered successfully');
  } catch (error) {
    console.error("Error signing up: ", error.message);
  }
});

// Brand login
document.getElementById('brandLoginBtn').addEventListener('click', async () => {
  const email = document.getElementById('brandLoginEmail').value;
  const password = document.getElementById('brandLoginPassword').value;

  try {
    const brandCredential = await signInWithEmailAndPassword(auth, email, password);
    const brand = brandCredential.user;
    console.log('Brand logged in as:', brand.email);
  } catch (error) {
    console.error("Error logging in brand: ", error.message);
  }
});

// Brand signup
document.getElementById('brandSignupBtn').addEventListener('click', async () => {
  const email = document.getElementById('brandSignupEmail').value;
  const password = document.getElementById('brandSignupPassword').value;
  const brandName = document.getElementById('brandName').value;
  const phone = document.getElementById('brandPhone').value;
  const country = document.getElementById('brandCountryDropdown').value;
  const website = document.getElementById('brandWebsite').value;
  const logoFile = document.getElementById('brandLogo').files[0];

  try {
    const brandCredential = await createUserWithEmailAndPassword(auth, email, password);
    const brand = brandCredential.user;
    console.log('Brand signed up as:', brand.email);

    const logoRef = ref(storage, `brands/${brand.uid}/logo.jpg`);
    await uploadBytes(logoRef, logoFile);

    await setDoc(doc(db, "brands", brand.uid), {
      brandName,
      email,
      phone,
      country,
      website,
      logoURL: logoRef.fullPath
    });

    alert('Brand registered successfully');
  } catch (error) {
    console.error("Error signing up brand: ", error.message);
  }
});

// Form toggle (User <-> Brand)
function toggleUserSignup() {
  document.getElementById('userSignup').classList.toggle('hidden');
}

function toggleBrandSignup() {
  document.getElementById('brandSignup').classList.toggle('hidden');
}

showUserForm();  // Start with the User form
