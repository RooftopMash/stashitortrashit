// Firebase Initialization (Separate Config File - firebase-config.js)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

// Initialize Firebase (Make sure firebase-config.js is included in HTML)
import { firebaseConfig } from "./firebase-config.js";
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to handle login (User/Brand)
async function handleLogin(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "dashboard.html";
    } catch (error) {
        alert("Login failed: " + error.message);
    }
}

// Function to handle signup (User/Brand)
async function handleSignup(email, password, isBrand = false) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        const userData = {
            email: email,
            country: document.getElementById(isBrand ? "brandCountryDropdown" : "userCountryDropdown").value,
            phone: document.getElementById(isBrand ? "brandPhone" : "userPhone").value,
        };

        if (isBrand) {
            userData.brandName = document.getElementById("brandName").value;
            userData.website = document.getElementById("brandWebsite").value;
        }

        await setDoc(doc(db, isBrand ? "brands" : "users", uid), userData);
        window.location.href = "dashboard.html";
    } catch (error) {
        alert("Signup failed: " + error.message);
    }
}

// Function to handle logout
async function handleLogout() {
    await signOut(auth);
    window.location.href = "index.html";
}

// Function to load user/brand profile
async function loadProfile() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                document.getElementById("userEmail").textContent = userDoc.data().email;
                document.getElementById("userCountry").textContent = userDoc.data().country;
                document.getElementById("userPhone").textContent = userDoc.data().phone;
            } else {
                const brandDoc = await getDoc(doc(db, "brands", user.uid));
                if (brandDoc.exists()) {
                    document.getElementById("userEmail").textContent = brandDoc.data().email;
                    document.getElementById("userCountry").textContent = brandDoc.data().country;
                    document.getElementById("userPhone").textContent = brandDoc.data().phone;
                }
            }
        } else {
            window.location.href = "index.html";
        }
    });
}

// Function to edit profile (User/Brand)
async function editProfile() {
    const user = auth.currentUser;
    if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const isBrand = !userDoc.exists(); // If userDoc doesn't exist, it is a brand

        const updateData = {
            country: document.getElementById("userCountry").textContent,
            phone: document.getElementById("userPhone").textContent,
        };

        if (isBrand) {
            updateData.brandName = document.getElementById("brandName").value;
            updateData.website = document.getElementById("brandWebsite").value;
        }

        await updateDoc(doc(db, isBrand ? "brands" : "users", user.uid), updateData);
        alert("Profile updated successfully!");
    }
}

// Event Listeners (Direct and Auto)
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("userLoginBtn")?.addEventListener("click", () => {
        handleLogin(document.getElementById("userLoginEmail").value, document.getElementById("userLoginPassword").value);
    });

    document.getElementById("userSignupBtn")?.addEventListener("click", () => {
        handleSignup(
            document.getElementById("userSignupEmail").value,
            document.getElementById("userSignupPassword").value
        );
    });

    document.getElementById("brandLoginBtn")?.addEventListener("click", () => {
        handleLogin(document.getElementById("brandLoginEmail").value, document.getElementById("brandLoginPassword").value);
    });

    document.getElementById("brandSignupBtn")?.addEventListener("click", () => {
        handleSignup(
            document.getElementById("brandSignupEmail").value,
            document.getElementById("brandSignupPassword").value,
            true
        );
    });

    document.getElementById("logoutBtn")?.addEventListener("click", handleLogout);
    loadProfile();
});
