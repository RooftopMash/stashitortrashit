// Firebase and App logic for Stash or Trash???
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";

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

const loginPage = document.getElementById("login-page");
const signupPage = document.getElementById("signup-page");
const welcomeSection = document.getElementById("welcome-section");
const ratingSection = document.getElementById("rating-section");
const productSection = document.getElementById("product-section");
const brandSelect = document.getElementById("brand");

let currentUser = null;
let selectedBrand = "";
let selectedRating = "";

// Country-based brand data
const brandsByCountry = {
  "USA": ["Nike", "Apple", "Coca-Cola", "McDonald's", "Amazon"],
  "United Kingdom": ["Tesco", "ASDA", "Sainsbury's", "Aldi", "Apple"],
  "South Africa": ["Shoprite", "Pick n Pay", "Game", "Woolworths", "Mr Price"],
  "Canada": ["Tim Hortons", "Lululemon", "RBC", "Air Canada"],
  "Australia": ["Woolworths", "Coles", "Qantas", "ANZ"],
  "Germany": ["BMW", "Volkswagen", "Adidas", "Mercedes-Benz"],
  "France": ["L'Oréal", "Carrefour", "Renault", "Danone"],
  "India": ["Tata", "Reliance", "Bajaj", "Flipkart"],
  "Japan": ["Sony", "Toyota", "Honda", "Nintendo"],
  "Brazil": ["Havaianas", "Petrobras", "Itaú", "Embraer"],
  "Mexico": ["Bimbo", "Corona", "Telmex", "Cemex"],
  "China": ["Huawei", "Alibaba", "Tencent", "BYD"]
};

window.showSignupPage = () => {
  loginPage.classList.add("hidden");
  signupPage.classList.remove("hidden");
};

window.showLoginPage = () => {
  signupPage.classList.add("hidden");
  loginPage.classList.remove("hidden");
};

window.updateBrandList = () => {
  const country = document.getElementById("country").value;
  brandSelect.innerHTML = '<option value="">--Select Brand--</option>';
  if (brandsByCountry[country]) {
    brandsByCountry[country].forEach(brand => {
      const option = document.createElement("option");
      option.value = brand;
      option.textContent = brand;
      brandSelect.appendChild(option);
    });
  }
};

window.signup = async () => {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const name = document.getElementById("full-name").value;
  const username = document.getElementById("username").value;
  const country = document.getElementById("country").value;
  const address = document.getElementById("address").value;
  const cellphone = document.getElementById("cellphone").value;
  const profilePicFile = document.getElementById("profile-pic").files[0];

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    let profilePicUrl = "";
    if (profilePicFile) {
      const picRef = ref(storage, 'profile_pics/' + user.uid + '_' + profilePicFile.name);
      await uploadBytes(picRef, profilePicFile);
      profilePicUrl = await getDownloadURL(picRef);
    }

    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      username,
      email,
      country,
      address,
      cellphone,
      profilePicUrl,
      createdAt: serverTimestamp()
    });

    currentUser = user;
    signupPage.classList.add("hidden");
    welcomeSection.classList.remove("hidden");
  } catch (e) {
    alert("Signup error: " + e.message);
  }
};

window.login = async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    currentUser = userCredential.user;
    loginPage.classList.add("hidden");
    welcomeSection.classList.remove("hidden");
  } catch (e) {
    alert("Login error: " + e.message);
  }
};

window.logout = async () => {
  try {
    await signOut(auth);
    currentUser = null;
    welcomeSection.classList.add("hidden");
    ratingSection.classList.add("hidden");
    loginPage.classList.remove("hidden");
  } catch (e) {
    alert("Logout error: " + e.message);
  }
};

window.showRatingSection = () => {
  ratingSection.classList.remove("hidden");
};

window.selectBrand = () => {
  selectedBrand = brandSelect.value;
  if (selectedBrand) {
    productSection.classList.remove("hidden");
  } else {
    productSection.classList.add("hidden");
  }
};

window.selectRating = (emoji) => {
  selectedRating = emoji;
};

window.submitRating = async () => {
  const product = document.getElementById("product").value.trim();
  const comment = document.getElementById("comment").value.trim();
  const mediaFile = document.getElementById("media").files[0];

  if (!selectedBrand || !product || !selectedRating) {
    alert("Please fill out all required fields and select a rating.");
    return;
  }

  let mediaUrl = "";
  if (mediaFile) {
    const mediaRef = ref(storage, 'ratings/' + currentUser.uid + '_' + mediaFile.name);
    await uploadBytes(mediaRef, mediaFile);
    mediaUrl = await getDownloadURL(mediaRef);
  }

  try {
    await addDoc(collection(db, "ratings"), {
      userId: currentUser.uid,
      brand: selectedBrand,
      product,
      rating: selectedRating,
      comment,
      mediaUrl,
      timestamp: serverTimestamp()
    });
    alert("Rating submitted successfully!");
    document.getElementById("product").value = "";
    document.getElementById("comment").value = "";
    document.getElementById("media").value = "";
    selectedRating = "";
    ratingSection.classList.add("hidden");
    welcomeSection.classList.remove("hidden");
  } catch (e) {
    alert("Error submitting rating: " + e.message);
  }
};
