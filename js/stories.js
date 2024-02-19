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
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
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

/* Write a function in ***stories.js*** that is called when users submit the form. Pick a good name for it. This function should get the data from the form, call the ***.addStory*** method you wrote, and then put that new story on the page. */

// display form when clicking on 'submit'
// $storySubmit.on("click", function() {
//   hidePageComponents();

//   $(".story-adding-container").show();

//   submitStory();

// }); 


// Event listener on submit form when form is submitted
$storyAddingForm.on("submit", submitStory);
// $submitBtn.on("input", submitStory); // it doesn't work with this one

// submit the form
function submitStory(evt){
  evt.preventDefault();

  // Make the story adding form visible
  $(".story-adding-container").show();

  // Get data from form
  let $titleInputData = $("#story-title-input").val(); 
  let $authorInputData = $("#story-author-input").val();
  let $storyURLData = $("#story-url-value").val();

  // Create a new Story instance
  // let newStory = new Story({
  //   $titleInputData: title,
  //   $authorInputData: author,
  //   SstoryURLData: url,
  //   username: currentUser.username, // Assuming currentUser is defined globally
  //   createdAt: new Date() // Assuming createdAt should be the current date
  // });

  let $storyInputData = `${$titleInputData} ${$authorInputData} ${$storyURLData}`;

  $(".story-adding-container").hide(); 

  // Show all stories list
  $(".stories-list").show();

  //addStory();

  $allStoriesList.append($storyInputData);
  // $allStoriesList.text($storyInputData);
}

