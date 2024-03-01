"use strict";

// So we don't have to keep re-finding things on page, find DOM elements once:

const $body = $("body");

const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list"); // All stories list
// All favorite stories (List of stories selected as favorite by user)
const $allFavoriteStories = $("#all-favorite-list"); //Selected stories as favorites
const $allMyStories = $("#all-my-stories"); // All my own stories

const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");
// story adding form and submit button
const $storyAddingForm = $("#story-adding-form"); // form to add a story
const $submitBtn = $("#submit-btn"); // Button of the add story form

const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $navLogOut = $("#nav-logout");
// Links on navbar: submit, favorites, my stories
const $navStorySubmit = $("#nav-submit"); // Hyperlink "submit"
const $navFavorites = $("#nav-favorites"); // Hyperlink "favorites"
const $navOwnStories = $("nav-my-stories"); // hyperlink "my stories"

/** To make it easier for individual components to show just themselves, this
 * is a useful function that hides pretty much everything on the page. After
 * calling this, individual components can re-show just what they want.
 */

function hidePageComponents() {
  const components = [
    $allStoriesList,
    $loginForm,
    $signupForm,
  ];
  components.forEach(c => c.hide());
}

/** Overall function to kick off the app. */

async function start() {
  console.debug("start");

  // "Remember logged-in user" and log in, if credentials in localStorage
  await checkForRememberedUser();
  await getAndShowStoriesOnStart();

  // if we got a logged-in user
  if (currentUser) updateUIOnUserLogin();
}

// Once the DOM is entirely loaded, begin the app

console.warn("HEY STUDENT: This program sends many debug messages to" +
  " the console. If you don't see the message 'start' below this, you're not" +
  " seeing those helpful debug messages. In your browser console, click on" +
  " menu 'Default Levels' and add Verbose");
$(start);
