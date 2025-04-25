
import {
    initializeApp
} from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import {
    getFirestore,
    collection,
    addDoc,
    getDocs
} from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBu1iRSWC3l7VGJvHyD49xXqqGdEIa9Kis", // Your actual API Key here
    authDomain: "stashortrash-acbbf.firebaseapp.com",
    projectId: "stashortrash-acbbf",
    storageBucket: "stashortrash-acbbf.appspot.com",
    messagingSenderId: "782905521538",
    appId: "1:782905521538:web:856d1e7789edd76882cb9b",
    measurementId: "G-8Y4ZXJTPM6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Pass app instance to getAuth
const db = getFirestore(app); // Initialize Firestore

// UI element references
const loginDiv = document.getElementById("login");
const productSelectionDiv = document.getElementById("product-selection");
const productListDiv = document.getElementById("product-list");

// --- Helper Functions ---
async function fetchProducts() {
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);
    const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    displayProducts(products);
}

function displayProducts(products) {
    productListDiv.innerHTML = ''; // Clear existing content

    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.textContent = product.name;
        productListDiv.appendChild(productItem);
    });
}

// Sign Up functionality
document.getElementById("signup-btn").addEventListener("click", () => {
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // User signed up successfully
            const user = userCredential.user;
            alert("Sign Up successful!");
            // Optionally redirect to another page or show logged-in screen
            document.getElementById("signup").style.display = "none"; // Hide sign up form
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(`Sign Up Failed: ${errorMessage}`);
        });
});

// Log In functionality
document.getElementById("login-btn").addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // User logged in successfully
            const user = userCredential.user;
            alert("Log In successful!");
            // Hide login form and show main app
            document.getElementById("login").style.display = "none"; // Hide login form
            productSelectionDiv.style.display = "block"; // Show product selection
            fetchProducts(); // Load products
            // Optionally show user-specific features after login
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(`Login Failed: ${errorMessage}`);
        });
});

// --- Add Product Functionality ---
document.getElementById("add-product-btn").addEventListener("click", async () => {
    const productName = document.getElementById("product-name").value;

    if (!productName) {
        alert("Please enter a product name.");
        return;
    }

    try {
        // Add a new document with a generated id.
        const docRef = await addDoc(collection(db, "products"), {
            name: productName
        });
        console.log("Document written with ID: ", docRef.id);
        document.getElementById("product-name").value = ""; // Clear the input
        fetchProducts(); // Refresh the product list
    } catch (e) {
        console.error("Error adding document: ", e);
        alert("Error adding product. Please check the console.");
    }
});

// --- Firebase Auth State Listener --- (Optional but recommended)
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        loginDiv.style.display = "none";
        productSelectionDiv.style.display = "block";
        fetchProducts(); // Load products
    } else {
        // User is signed out
        loginDiv.style.display = "block";
        productSelectionDiv.style.display = "none";
    }
});
