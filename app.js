// Import Firebase v9 modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

// ✅ Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBu1iRSWC3l7VGJvHyD49xXqqGdEIa9Kis",
  authDomain: "stashortrash-acbbf.firebaseapp.com",
  projectId: "stashortrash-acbbf",
  storageBucket: "stashortrash-acbbf.firebasestorage.app",
  messagingSenderId: "782905521538",
  appId: "1:782905521538:web:856d1e7789edd76882cb9b",
  measurementId: "G-8Y4ZXJTPM6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

// ========================
// 🔑 USER AUTH HANDLERS
// ========================

document.getElementById("userSignupBtn").addEventListener("click", async () => {
  const email = document.getElementById("userSignupEmail").value;
  const password = document.getElementById("userSignupPassword").value;
  const phone = document.getElementById("userPhone").value;
  const country = document.getElementById("userCountryDropdown").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      email,
      phone,
      country,
      role: "user"
    });

    alert("User registered successfully!");
  } catch (error) {
    console.error("User signup error:", error.message);
    alert("Error: " + error.message);
  }
});

document.getElementById("userLoginBtn").addEventListener("click", async () => {
  const email = document.getElementById("userLoginEmail").value;
  const password = document.getElementById("userLoginPassword").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      alert("Welcome back, User!");
    } else {
      alert("No user profile found.");
    }
  } catch (error) {
    alert("Login error: " + error.message);
  }
});

// ========================
// 🏢 BRAND AUTH HANDLERS
// ========================

document.getElementById("brandSignupBtn").addEventListener("click", async () => {
  const email = document.getElementById("brandSignupEmail").value;
  const password = document.getElementById("brandSignupPassword").value;
  const phone = document.getElementById("brandPhone").value;
  const brandName = document.getElementById("brandName").value;
  const country = document.getElementById("brandCountryDropdown").value;
  const website = document.getElementById("brandWebsite").value;
  const logoFile = document.getElementById("brandLogo").files[0];

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const brandUser = userCredential.user;

    let logoURL = "";
    if (logoFile) {
      const logoRef = ref(storage, `brand_logos/${brandUser.uid}/${logoFile.name}`);
      await uploadBytes(logoRef, logoFile);
      logoURL = await getDownloadURL(logoRef);
    }

    await setDoc(doc(db, "brands", brandUser.uid), {
      email,
      phone,
      brandName,
      country,
      website,
      logoURL,
      role: "brand"
    });

    alert("Brand registered successfully!");
  } catch (error) {
    console.error("Brand signup error:", error.message);
    alert("Error: " + error.message);
  }
});

document.getElementById("brandLoginBtn").addEventListener("click", async () => {
  const email = document.getElementById("brandLoginEmail").value;
  const password = document.getElementById("brandLoginPassword").value;

  try {
    const brandCredential = await signInWithEmailAndPassword(auth, email, password);
    const brandUser = brandCredential.user;

    const brandDoc = await getDoc(doc(db, "brands", brandUser.uid));
    if (brandDoc.exists()) {
      alert("Welcome back, Brand Account!");
    } else {
      alert("No brand profile found.");
    }
  } catch (error) {
    alert("Login error: " + error.message);
  }
});

// ========================
// 🌍 POPULATE COUNTRY DROPDOWNS
// ========================

const countries = [
  { code: "AF", name: "Afghanistan" },
  { code: "AL", name: "Albania" },
  { code: "DZ", name: "Algeria" },
  { code: "AS", name: "American Samoa" },
  { code: "AD", name: "Andorra" },
  { code: "AO", name: "Angola" },
  { code: "AI", name: "Anguilla" },
  { code: "AQ", name: "Antarctica" },
  { code: "AG", name: "Antigua and Barbuda" },
  { code: "AR", name: "Argentina" },
  { code: "AM", name: "Armenia" },
  { code: "AW", name: "Aruba" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "AZ", name: "Azerbaijan" },
  { code: "BS", name: "Bahamas" },
  { code: "BH", name: "Bahrain" },
  { code: "BD", name: "Bangladesh" },
  { code: "BB", name: "Barbados" },
  { code: "BY", name: "Belarus" },
  { code: "BE", name: "Belgium" },
  { code: "BZ", name: "Belize" },
  { code: "BJ", name: "Benin" },
  { code: "BM", name: "Bermuda" },
  { code: "BT", name: "Bhutan" },
  { code: "BO", name: "Bolivia" },
  { code: "BA", name: "Bosnia and Herzegovina" },
  { code: "BW", name: "Botswana" },
  { code: "BR", name: "Brazil" },
  { code: "BN", name: "Brunei Darussalam" },
  { code: "BG", name: "Bulgaria" },
  { code: "BF", name: "Burkina Faso" },
  { code: "BI", name: "Burundi" },
  { code: "KH", name: "Cambodia" },
  { code: "CM", name: "Cameroon" },
  { code: "CA", name: "Canada" },
  { code: "CV", name: "Cape Verde" },
  { code: "KY", name: "Cayman Islands" },
  { code: "CF", name: "Central African Republic" },
  { code: "TD", name: "Chad" },
  { code: "CL", name: "Chile" },
  { code: "CN", name: "China" },
  { code: "CO", name: "Colombia" },
  { code: "KM", name: "Comoros" },
  { code: "CG", name: "Congo" },
  { code: "CD", name: "Congo, Democratic Republic of the" },
  { code: "CR", name: "Costa Rica" },
  { code: "HR", name: "Croatia" },
  { code: "CU", name: "Cuba" },
  { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czech Republic" },
  { code: "DK", name: "Denmark" },
  { code: "DJ", name: "Djibouti" },
  { code: "DM", name: "Dominica" },
  { code: "DO", name: "Dominican Republic" },
  { code: "EC", name: "Ecuador" },
  { code: "EG", name: "Egypt" },
  { code: "SV", name: "El Salvador" },
  { code: "GQ", name: "Equatorial Guinea" },
  { code: "ER", name: "Eritrea" },
  { code: "EE", name: "Estonia" },
  { code: "ET", name: "Ethiopia" },
  { code: "FJ", name: "Fiji" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "GA", name: "Gabon" },
  { code: "GM", name: "Gambia" },
  { code: "GE", name: "Georgia" },
  { code: "DE", name: "Germany" },
  { code: "GH", name: "Ghana" },
  { code: "GR", name: "Greece" },
  { code: "GD", name: "Grenada" },
  { code: "GT", name: "Guatemala" },
  { code: "GN", name: "Guinea" },
  { code: "GW", name: "Guinea-Bissau" },
  { code: "GY", name: "Guyana" },
  { code: "HT", name: "Haiti" },
 
::contentReference[oaicite:0]{index=0}
 
