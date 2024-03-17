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
function generateStoryMarkup(story, showTrashbin) {
  const hostName = story.getHostName(); 
  if (!currentUser) {
    return $(`
    <li id="${story.storyId}">
        <div class="story-container">
            <a href="${story.url}" target="a_blank" class="story-link">${story.title}</a>
        </div>
        <small class="story-hostname">(${hostName})</small>
        <div class="story-author">by ${story.author}</div>
        <div class="story-user">posted by ${story.username}</div>
    </li>
`);

  } else {
  const isFavorite = currentUser.favorites.find(s => s.storyId === story.storyId);
  const isOwnStory = currentUser.ownStories.find(s => s.storyId === story.storyId);

  const isChecked = isFavorite ? 'checked' : '';
  const isTrashbinChecked = isOwnStory ? 'checked' : '';

  // Conditional style for the trashbin checkbox container
  const trashbinStyle = showTrashbin ? '' : 'display: none;';

  return $(`
      <li id="${story.storyId}">
          <div class="story-container">

              <div class="trashbin-checkbox" style="${trashbinStyle}">
                  <img src="images/trashbin.jpg" alt="Trash Bin" class="trashbin-img"/>
                  <input type="checkbox" class="trashbin-input" id="trashbin-${story.storyId}"/>
                  <label class="trashbin-input for="trashbin-${story.storyId}"></label>
              </div>

              <div class="star-checkbox">
                  <input type="checkbox" class="star-input" id="star-${story.storyId}" ${isChecked}/> 
                  <label for="star-${story.storyId}"></label>
              </div>

              <a href="${story.url}" target="a_blank" class="story-link">${story.title}</a>
              <small class="story-hostname">(${hostName})</small>         
          </div>   
          <div class="story-author">by ${story.author}</div>
          <div class="story-user">posted by ${story.username}</div>       
      </li>
  `);
}
}

/* Get list of stories, generate their HTML, and puton page */
function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();
  $allFavoriteStories.empty();
  $allMyStories.empty();

  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story, false);
    $allStoriesList.append($story);
  }
  $allStoriesList.show();
}

/* Get list of favorites, generate their HTML, and puton page */
function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");

  $allStoriesList.empty();
  $allFavoriteStories.empty();
  $allMyStories.empty();

  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story, false);
    $allFavoriteStories.append($story);
  }
  $allFavoriteStories.show();
}

/* Get list of my stories, generate their HTML, and puton page */
function putMyStoriesOnPage() {
  console.debug("putMyStoriesOnPage");

  $allStoriesList.empty();
  $allFavoriteStories.empty();
  $allMyStories.empty();

  for (let story of currentUser.ownStories) {
    const $story = generateStoryMarkup(story, true);
    $allMyStories.append($story);
  }
  $allMyStories.show();
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
    $storyAddingForm.trigger("reset");// Reset the inputs of the form
  } catch (error) {
    console.error("Error submitting story: ", error);
  }
}

$storyAddingForm.on("submit", submitStory);

/* Identify the selected favorite story, then add or remove it */
async function findSelectedStory(evt) {
  const $targetedStar = $(evt.target);
  const $closestLi = $targetedStar.closest("li");
  const storyId = $closestLi.attr("id"); 
  console.log("Star selected");
  const isFavorited = currentUser.favorites.find(s => s.storyId === storyId);
  const story = storyList.stories.find(s => s.storyId === storyId);

  if (isFavorited) {
    await currentUser.removeFavorite(story);
  } else {
    await currentUser.addFavorite(story);
  }
}

$allStoriesList.on('change', '.star-input', findSelectedStory);
$allFavoriteStories.on('change', '.star-input', findSelectedStory);
$allMyStories.on('change', '.star-input', findSelectedStory);

/* Find selected trashbin checkbox */
async function findStoryToDelete(evt) {
  console.log("I found story to delete!");

    const $targetedTrashbin = $(evt.target);
    const $closestLi = $targetedTrashbin.closest("li");
    const storyId = $closestLi.attr("id"); 
  
    // $allMyStories.show();
    await storyList.removeStory(currentUser, storyId);
    $allMyStories.hide();
    hidePageComponents();
    putMyStoriesOnPage();
    $allMyStories.show();

}
$allMyStories.on('change', '.trashbin-input', findStoryToDelete);


/* Display all favorite stories */
function displayFavoriteStories() {
  $allFavoriteStories.empty(); 
  
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story); 
    $allFavoriteStories.append($story); 
    findSelectedStory();
  }
  $allFavoriteStories.show(); 
}

// Event handler for clicking on the Favorites link
$navFavorites.on("click", displayFavoriteStories);









