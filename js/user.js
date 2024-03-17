"use strict";

// Currently-logged-in user
let currentUser;

/* Handle login form submission */
async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();

  const username = $("#login-username").val();
  const password = $("#login-password").val();

  currentUser = await User.login(username, password); // Retrieves user login info from API 
  console.log(currentUser);

  // Shows submit, favorites, my stories from navbar when logged-in
  $("#nav-user-links").removeClass("hidden"); 
  $("#nav-user-links").addClass("authenticated");  
   
  $loginForm.trigger("reset");

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();
}

$loginForm.on("submit", login);

/* Handle signup form submission. */
async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  currentUser = await User.signup(username, password, name); // Retrieves user signup info from API 

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();

  $signupForm.trigger("reset");
}

$signupForm.on("submit", signup);

/* Handle click of logout button to remove user's credentials from localStorage */
function logout(evt) {
  console.debug("logout", evt);

  // Hide submit, favorites, my stories from navbar when loggedout
  $("#nav-user-links").addClass("hidden"); 
  $("#nav-user-links").removeClass("authenticated");

  localStorage.clear();
  location.reload();
}

$navLogOut.on("click", logout);

/* Recall registered user in localStorage */
async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  currentUser = await User.loginViaStoredCredentials(token, username); // try to log in with user's credentials 
}

/* Sync current user information to localStorage */
function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
  }
}

/* When a user signs up, generate user's profile: set up their UI on the navbar and the page */
function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin");

  $allStoriesList.show();
  updateNavOnLogin();
}


