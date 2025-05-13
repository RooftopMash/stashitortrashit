// Initialize Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBu1iRSWC3l7VGJvHyD49xXqqGdEIa9Kis",
    authDomain: "stashortrash-acbbf.firebaseapp.com",
    projectId: "stashortrash-acbbf",
    storageBucket: "stashortrash-acbbf.firebasestorage.app",
    messagingSenderId: "782905521538",
    appId: "1:782905521538:web:856d1e7789edd76882cb9b",
    measurementId: "G-8Y4ZXJTPM6"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User is logged in:', user.email);
        // Show user profile info if necessary
    } else {
        console.log('No user logged in');
        // Redirect to login page if necessary
    }
});

// Function to handle product ratings
async function rateProduct(type) {
    const user = auth.currentUser;
    if (!user) {
        alert("Please log in to rate products.");
        return;
    }

    try {
        const docRef = await addDoc(collection(db, "ratings"), {
            userId: user.uid,
            type: type,
            timestamp: new Date(),
        });
        console.log("Rating saved with ID: ", docRef.id);
        alert(`Product rated as: ${type}`);
    } catch (e) {
        console.error("Error adding document: ", e);
        alert("Error saving rating. Please try again.");
    }
}
