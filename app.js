// Firebase Configuration
const firebaseConfig = {
  apiKey: "your-api-key-here", 
  authDomain: "your-auth-domain-here",
  projectId: "your-project-id-here",
  storageBucket: "your-storage-bucket-here",
  messagingSenderId: "your-sender-id-here",
  appId: "your-app-id-here"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

// Elements
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
