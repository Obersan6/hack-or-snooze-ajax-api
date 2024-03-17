"use strict";

/* Handle navbar clicks and updating navbar: Show all stories list when clicking "Hack or Snooze" */
function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  $allFavoriteStories.hide();
  $allMyStories.hide();
}

$body.on("click", "#nav-all", navAllStories);

/* Show login/signup forms on click on "login" */
function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/* When user logins in, update the navbar to reflect that. */
function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

// Handle form clicks to retrieve and make the story submitting form visible
$navStorySubmit.on("click", function(evt) {
  evt.preventDefault(); 
  hidePageComponents();
  $allFavoriteStories.hide(); 
  $allMyStories.hide();
  $(".story-adding-container").show();  
 });

function navFavorites(evt) {
  console.debug("navFavorites", evt);
  hidePageComponents();
  $allMyStories.hide();
  $(".story-adding-container").hide(); // Hide story adding form when switching to favorites
  putFavoritesOnPage();
}

$body.on("click", "#nav-favorites", navFavorites);

function navMyStories(evt) {
  console.debug("navMyStories", evt);
  hidePageComponents();
  $allFavoriteStories.hide();
  $(".story-adding-container").hide(); // Hide story adding form when switching to my stories
  putMyStoriesOnPage();
}

$body.on("click", "#nav-my-stories", navMyStories);










