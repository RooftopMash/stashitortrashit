// App.js (Final Version)

// Redirect to Profile (For Testing)
document.getElementById("userLoginBtn").addEventListener("click", () => {
  window.location.href = "dashboard.html";
});

// Toggle User/Brand Forms
function showUserForm() {
  document.getElementById("userForm").style.display = "block";
  document.getElementById("brandForm").style.display = "none";
}

function showBrandForm() {
  document.getElementById("brandForm").style.display = "block";
  document.getElementById("userForm").style.display = "none";
}

function toggleUserSignup() {
  document.getElementById("userSignup").style.display = 
    document.getElementById("userSignup").style.display === "none" ? "block" : "none";
}

function toggleBrandSignup() {
  document.getElementById("brandSignup").style.display = 
    document.getElementById("brandSignup").style.display === "none" ? "block" : "none";
}
