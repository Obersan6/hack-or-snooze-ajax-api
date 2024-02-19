"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/*  SUBPART 2B: Building The UI for New Story Form/Add New Story
Now, we’ll add the UI for the story-adding feature:
- Write a function in ***nav.js*** that is called when users click that navbar link. Look at the other function names in that file that do similar things and pick something descriptive and similar.
- Write a function in ***stories.js*** that is called when users submit the form. Pick a good name for it. This function should get the data from the form, call the ***.addStory*** method you wrote, and then put that new story on the page. */

/* - Write a function in ***nav.js*** 
- that is called when users click that navbar link. 
- Look at the other function names in that file that do similar things and pick something descriptive and similar. */

$storySubmit.on("click", function() {
  hidePageComponents();

  $(".story-adding-container").show();

  submitStory();

  $(".story-adding-container").hide(); 
});







