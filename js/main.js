"use strict";

const $body = $("body");

const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list"); 
const $allFavoriteStories = $("#all-favorite-list"); 
const $allMyStories = $("#all-my-stories"); 

const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");

const $storyAddingForm = $("#story-adding-form"); 
const $submitBtn = $("#submit-btn"); 

const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $navLogOut = $("#nav-logout");

const $navStorySubmit = $("#nav-submit"); 
const $navFavorites = $("#nav-favorites"); 
const $navOwnStories = $("nav-my-stories"); 

/* Hide all stories list, login form, and signup form */
function hidePageComponents() {
  const components = [
    $allStoriesList,
    $loginForm,
    $signupForm,
  ];
  components.forEach(c => c.hide());
}

/* Start the app. */
async function start() {
  console.debug("start");

  await checkForRememberedUser();
  await getAndShowStoriesOnStart();

  if (currentUser) updateUIOnUserLogin();
}

// Once the DOM is entirely loaded, begin the app
console.warn("HEY STUDENT: This program sends many debug messages to" +
  " the console. If you don't see the message 'start' below this, you're not" +
  " seeing those helpful debug messages. In your browser console, click on" +
  " menu 'Default Levels' and add Verbose");
$(start);
