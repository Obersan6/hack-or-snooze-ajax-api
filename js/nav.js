"use strict";

/* Handle navbar clicks and updating navbar: Show all stories list when clicking "Hack or Snooze" */
function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
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
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

// Handle form clicks to retrieve and make the story submitting form visible
 $navStorySubmit.on("click", function(evt) {
  evt.preventDefault(); 
  hidePageComponents();
  $(".story-adding-container").show();
 });










