"use strict";

// Instance of StoryList
let storyList;

/* Get and show stories when site first loads. */
async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
  putStoriesOnPage();
}

/* Render the markup for an individual Story instance */
function generateStoryMarkup(story) {
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

/* Get list of stories, generate their HTML, and puton page */
function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  $allStoriesList.show();
}

/* Get data from the submit story form, add story to API, put the story on the page */
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
    await storyList.addStory(currentUser, storyData);  
    putStoriesOnPage(); 
  } catch (error) {
    console.error("Error submitting story: ", error);
  }
}

$storyAddingForm.on("submit", submitStory);

/* Identify the selected favorite story, then add or remove it */
function findSelectedStory(evt) {
  const $targetedStar = $(evt.target);

  if ($targetedStar.prop("checked")) {
    const $closestLi = $targetedStar.closest("li");
    const $storyId = $closestLi.attr("id"); 
    const story = storyList.stories.find(s => s.storyId === $storyId); // Find the specific favorite storyId 

    currentUser.addFavorite(story);
    localStorage.setItem(story.storyId, "checked");
    generateStoryMarkup(story);
    $allFavoriteStories.append(story);
  } else {
    currentUser.removeFavorite(story); 
    localStorage.removeItem(storyId);
    generateStoryMarkup(story);
    $allFavoriteStories.remove($story);  
  }
  $allFavoriteStories.show();
}

$allStoriesList.on('change', 'input[type="checkbox"]', findSelectedStory);

/* Restore the state of selected stories from localStorage when the page loads */
function restoreSelectedStoriesState() {
  for (let i = 0; i < localStorage.length; i++) {
    const storyId = localStorage.key(i);
    const $checkbox = $(`#star-${storyId}`);
    if ($checkbox) {
      $checkbox.prop('checked', true);
    }
  }
}

/* Call restoreSelectedStoriesState when the page loads */
$(document).ready(function() {
  restoreSelectedStoriesState();
});

/* Display all favorite stories */
function displayFavoriteStories() {
  $allFavoriteStories.empty(); 
  
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story); 
    $allFavoriteStories.append($story); 
  }
  $allFavoriteStories.show(); 
}

// Event handler for clicking on the Favorites link
$navFavorites.on("click", function() {
  displayFavoriteStories(); 
});







