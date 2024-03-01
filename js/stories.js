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

// Call event when the star input changes its state and call findSelectedStory
$allStoriesList.on('change', 'input[type="checkbox"]', findSelectedStory);

/////////////////////////////////////////VERSION 2
// Find the selected story and its id to then add/remove it, then check if selected or unselected
function findSelectedStory(evt) {
  // Access the element that was selected
  const $targetedStar = $(evt.target);

  if ($targetedStar.prop("checked")) {
    // Get the "li" closest to targetedStar
    const $closestLi = $targetedStar.closest("li");
    // Get the story attribute "id"
    const $storyId = $closestLi.attr("id"); // ANADIR $ TO THE CONST NAME
    // Find the specific storyId for the specific story which "li" was targeted from the entire story list
    const story = storyList.stories.find(s => s.storyId === $storyId);
    console.log("Checkbox is checked!");
    currentUser.addFavorite(story);
    localStorage.setItem(story.storyId, "checked");
    generateStoryMarkup(story);
    $allFavoriteStories.append(story);
  
  } else {
    currentUser.removeFavorite(story); 
    localStorage.removeItem(storyId);
    generateStoryMarkup(story);
    $allFavoriteStories.remove($story);  
    console.log("Checkbox is unchecked"); // Check if checbox is/was unchecked
  }
  // Display all favorite stories
  $allFavoriteStories.show();
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

// Function to display all favorite stories
function displayFavoriteStories() {
  $allFavoriteStories.empty(); // Clear existing content
  
  // Loop through all favorite stories of the current user
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story); // Generate markup for the story
    $allFavoriteStories.append($story); // Append the markup to the container
  }
  
  $allFavoriteStories.show(); // Show the container
}

// Event handler for clicking on the Favorites link
$navFavorites.on("click", function() {
  displayFavoriteStories(); // Call the function to display favorite stories
});







