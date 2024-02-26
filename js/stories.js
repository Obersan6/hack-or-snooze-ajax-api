"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName(); 
  return $(`
      <li id="${story.storyId}">
        <div class="star-checkbox">
          <input type="checkbox" id="star-${story.storyId}"/> 
          <label for="star-${story.storyId}"></label>
          <a href="${story.url}" target="a_blank" class="story-link">${story.title}</a>
        </div>
        
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

// Function that is called when users submit the form. 
//Handle story form submission when the submit button is clicked
$storyAddingForm.on("submit", submitStory);

// Get data from submit story form, add story to API, put the story on the page
async function submitStory(evt){
  evt.preventDefault();

  // Get data from form
  const username = currentUser.username;
  const title = $("#story-title-input").val(); 
  const author= $("#story-author-input").val();
  const url = $("#story-url-input").val();

  const storyData = { username, title, author, url };

  $(".story-adding-container").hide(); // Hide form to submit story
  try {
    await storyList.addStory(currentUser, storyData); // Add story   
    putStoriesOnPage(); // Append story to the page
  } catch (error) {
    console.error("Error submitting story: ", error);
  }
}

// Call event when the star input changes its state and call favoriteAddOrRemove
$allStoriesList.on('change', 'input[type="checkbox"]', favoriteAddOrRemove);

// Find the selected story and its id to then add/remove it, then check if selected or unselected
async function findSelectedStory(evt) {
  // Access the element that was selected
  const $targetedStar = $(evt.target);
  // Get the "li" closest to targetedStar
  const $closestLi = $targetedStar.closest("li");
  // Get the story attribute "id"
  const $storyId = $closestLi.attr("id");
  // Find the specific storyId for the specific story which "li" was targeted from the entire story list
  const story = storyList.stories.find(s => s.storyId === storyId);
}

// Restore the state of selected stories from localStorage when the page loads
function restoreSelectedStoriesState() {
  for (let i = 0; i < localStorage.length; i++) {
    const storyId = localStorage.key(i);
    const $checkbox = $(`#star-${storyId}`);
    if ($checkbox) {
      $checkbox.prop('checked', true);
    }
  }
}

// Call restoreSelectedStoriesState when the page loads
$(document).ready(function() {
  restoreSelectedStoriesState();
});

// Allow logged in users to see a separate list of favorited stories.
function putFavoriteStoriesOnPage() {
  // Empty all stories list
  $allStoriesList.hide();
  // Empty favorites
  //$allFavoriteStories.empty(); 

  restoreSelectedStoriesState();

  if ($targetedStar.prop("checked")) { //Check if checkbox was checked
    console.log("Checkbox is checked");
    currentUser.addFavorite(story)// CREATE THIS FUNCTION IN MODELS.JS
    localStorage.setItem(storyId, "checked");
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      // $allFavoriteStories.append($story);
      $navFavorites.append($story);

    }
  } else {
    console.log("Checkbox is unchecked"); // Check if checbox is/was unchecked
    currentUser.removeFavorite(story); //CREATE THIS FUNCTION IN MODELS.JS
    localStorage.removeItem(storyId);
    // loop through all of favorite stories and generate HTML for them
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      // $allFavoriteStories.remove($story);
      $navFavorites.remove($story);
    }
  }
  // Display all favorite stories
  //$allFavoriteStories.show();
  $navFavorites.show();
}

$navFavorites.on("click", putFavoriteStoriesOnPage);






/** SUBPART 3A: DATA/API CHANGES

- Allow logged in users to see a separate list of favorited stories.

- The methods for adding and removing favorite status on a story should be defined in the "User class".
 */