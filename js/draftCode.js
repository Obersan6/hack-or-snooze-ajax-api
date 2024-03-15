// Markup function that is working sort of
/* Render the markup for an individual Story instance */
function generateStoryMarkup(story, showTrashbin) {
  const hostName = story.getHostName(); 
  const isFavorite = currentUser.favorites.find(s => s.storyId === story.storyId);
  const isOwnStory = currentUser.ownStories.find(s => s.storyId === story.storyId);

  const isChecked = isFavorite ? 'checked' : '';
  const isTrashbinChecked = isOwnStory ? 'checked': '';

  // Conditional class for the trashbin checkbox container
  const trashbinClass = showTrashbin ? 'trashbin-checkbox' : 'trashbin-checkbox hidden';

  return $(`
      <li id="${story.storyId}">
        <div class="story-container">

          <div class="${trashbinClass}">
              <img src="images/trashbin.jpg" alt="Trash Bin" class="trashbin-img"/>
              <input type="checkbox" id="trashbin-${story.storyId}" ${isTrashbinChecked}/>
              <label for="trashbin-${story.storyId}"></label>
          </div>

          <div class="star-checkbox">
            <input type="checkbox" id="star-${story.storyId}" ${isChecked}/> 
            <label for="star-${story.storyId}"></label>
          </div>

          <a href="${story.url}" target="_blank" class="story-link">${story.title}</a>

        </div>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}


////////////////////////////////////////////// MODIFY "findSelectedStory()"
/* Identify the selected favorite story, then add or remove it */
function findSelectedStory(evt) {
  const $targetedStar = $(evt.target);
  const $closestLi = $targetedStar.closest("li");
  const $storyId = $closestLi.attr("id"); 

  if (localStorage.getItem($storyId)) {
    // Remove from favorites
    currentUser.removeFavorite(storyList.stories.find(s => s.storyId === $storyId));
    localStorage.removeItem($storyId);
    $closestLi.remove(); // Remove the favorite story from the list
  } else if ($targetedStar.prop("checked")) {
    // Add to favorites
    const story = storyList.stories.find(s => s.storyId === $storyId); 
    currentUser.addFavorite(story);
    localStorage.setItem($storyId, "checked");
    generateStoryMarkup(story);
    $allFavoriteStories.append(story);
  }

  $allFavoriteStories.show();
}


//////////////////////////////////////////////VERSION 3
// function findSelectedStory(evt) {
//   const $targetedCheckbox = $(evt.target);
//   const $closestLi = $targetedCheckbox.closest("li");
//   const storyId = $closestLi.attr("id");

//   if ($targetedCheckbox.attr('id').startsWith('star')) {
//     // Handling favorites checkbox
//     if ($targetedCheckbox.prop("checked")) {
//       // Add to favorites
//       const story = storyList.stories.find(s => s.storyId === storyId);
//       currentUser.addFavorite(story);
//       localStorage.setItem(storyId, "checked");
//     } else {
//       // Remove from favorites
//       currentUser.removeFavorite(storyList.stories.find(s => s.storyId === storyId));
//       localStorage.removeItem(storyId);
//     }
//   } else if ($targetedCheckbox.attr('id').startsWith('trashbin').prop("checked")) {
//     // Handling trash bin checkbox
    
//       // Remove from own stories
//       currentUser.removeStory(storyList.stories.find(s => s.storyId === storyId));
//       localStorage.removeItem(storyId);
//       // Remove the story from the list visually
//       $closestLi.remove(); 
//   }
// }

// $allStoriesList.on('change', 'input[type="checkbox"]', findSelectedStory);

// $allStoriesList.on('change', 'input[type="checkbox"][id^="trashbin-"]', findSelectedStory);

