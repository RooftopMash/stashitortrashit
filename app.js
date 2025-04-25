// Initialize Firebase
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Welcome page logic
document.getElementById('continueToRate').addEventListener('click', () => {
  document.getElementById('welcomePage').style.display = 'none';
  showBrandSelection();
});

// Brand selection logic
let brands = ["Coca-Cola", "Nike", "Apple", "Samsung", "Pepsi"]; // Example brands

function showBrandSelection() {
  const brandList = document.getElementById('brandList');
  brands.forEach((brand) => {
    const brandButton = document.createElement('button');
    brandButton.textContent = brand;
    brandButton.addEventListener('click', () => {
      localStorage.setItem('selectedBrand', brand);
      showProductRatingInterface();
    });
    brandList.appendChild(brandButton);
  });
  document.getElementById('brandPage').style.display = 'block';
}

function showProductRatingInterface() {
  document.getElementById('brandPage').style.display = 'none';
  document.getElementById('ratingPage').style.display = 'block';
}

// Handle user login
document.getElementById('loginButton').addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      document.getElementById('userEmail').textContent = user.email;
      document.getElementById('loginPage').style.display = 'none';
      document.getElementById('userInfo').style.display = 'block';
      showBrandSelection();
    })
    .catch((error) => {
      console.error(error.message);
    });
});

// Handle user signup
document.getElementById('signUpButton').addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      document.getElementById('userEmail').textContent = user.email;
      document.getElementById('loginPage').style.display = 'none';
      document.getElementById('userInfo').style.display = 'block';
      showBrandSelection();
    })
    .catch((error) => {
      console.error(error.message);
    });
});

// Submit rating
document.getElementById('submitRating').addEventListener('click', () => {
  const productName = document.getElementById('productName').value;
  const emojiRating = document.querySelector('button.selected').textContent; // 💰 or 🚮
  const comment = document.getElementById('commentBox').value;
  const file = document.getElementById('mediaUpload').files[0];
  const userId = auth.currentUser.uid;
  const brand = localStorage.getItem('selectedBrand');

  // Upload media to Firebase Storage
  let mediaUrl = '';
  if (file) {
    const storageRef = storage.ref().child(`media/${file.name}`);
    storageRef.put(file).then(() => {
      storageRef.getDownloadURL().then((url) => {
        mediaUrl = url;
        saveRatingToFirestore(productName, emojiRating, comment, mediaUrl, brand, userId);
      });
    });
  } else {
    saveRatingToFirestore(productName, emojiRating, comment, mediaUrl, brand, userId);
  }
});

// Save rating to Firestore
function saveRatingToFirestore(productName, emojiRating, comment, mediaUrl, brand, userId) {
  db.collection('ratings').add({
    productName,
    emojiRating,
    comment,
    mediaUrl,
    brand,
    userId,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    alert('Rating submitted!');
    resetRatingInterface();
  }).catch((error) => {
    console.error('Error submitting rating: ', error);
  });
}

// Reset the rating interface
function resetRatingInterface() {
  document.getElementById('productName').value = '';
  document.getElementById('commentBox').value = '';
  document.getElementById('mediaUpload').value = '';
  document.getElementById('ratingPage').style.display = 'none';
  document.getElementById('brandPage').style.display = 'block';
}
