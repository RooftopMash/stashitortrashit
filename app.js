// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBu1iRSWC3l7VGJvHyD49xXqqGdEIa9Kis", 
  authDomain: "stashortrash-acbbf.firebaseapp.com",
  projectId: "stashortrash-acbbf",
  storageBucket: "stashortrash-acbbf.firebasestorage.app",
  messagingSenderId: "782905521538",
  appId: "1:782905521538:web:856d1e7789edd76882cb9b",
  measurementId: "G-8Y4ZXJTPM6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

// Elements for product rating
const stashBtn = document.querySelector(".stash");
const trashBtn = document.querySelector(".trash");

// Click handlers for stash/trash buttons
stashBtn.addEventListener("click", () => rateProduct("stash"));
trashBtn.addEventListener("click", () => rateProduct("trash"));

// Function to save the rating to Firestore
function rateProduct(rating) {
  const productRef = db.collection("ratings").doc("CocaCola");

  productRef.update({
    [rating]: firebase.firestore.FieldValue.increment(1)
  })
  .then(() => {
    alert(`You rated Coca-Cola as ${rating === 'stash' ? 'Stash' : 'Trash'}`);
  })
  .catch((error) => {
    console.error("Error adding document: ", error);
  });
}

// Elements for rating the AI
const durabilityBtn = document.querySelector(".rate-durability");
const functionalityBtn = document.querySelector(".rate-functionality");
const helpfulnessBtn = document.querySelector(".rate-helpfulness");

// Click handlers for AI rating buttons
durabilityBtn.addEventListener("click", () => rateAI("durability"));
functionalityBtn.addEventListener("click", () => rateAI("functionality"));
helpfulnessBtn.addEventListener("click", () => rateAI("helpfulness"));

// Function to save the AI rating to Firestore
function rateAI(ratingType) {
  const aiRef = db.collection("ai_ratings").doc("assistant");

  aiRef.update({
    [ratingType]: firebase.firestore.FieldValue.increment(1)
  })
  .then(() => {
    alert(`You rated the AI's ${ratingType} as 👍!`);
  })
  .catch((error) => {
    console.error("Error adding document: ", error);
  });
}
