"use strict";

const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";


/* A single story in the system */
class Story {
  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }

  // Parse hostname out of URL and return it. */
  getHostName() {
    return new URL(this.url).host; 
  }
}

/* List of Story instances */
class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  static async getStories() {
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET",
    });

    const stories = response.data.stories.map(story => new Story(story));

    return new StoryList(stories); // New instance of StoryList using the new array of stories
  }

  // Add story data to API 
  async addStory(user, {title, author, url}) {
    const token = user.loginToken;
    const response = await axios({
      method: "POST",
      url: `${BASE_URL}/stories`,
      data: { token, story: { title, author, url } },
    });

     const story = new Story(response.data.story);
     this.stories.unshift(story);
     user.ownStories.unshift(story); 

    return story;
  }

  // Remove story data from the API 
  async removeStory(user, storyId) {
    const token = user.loginToken;
    await axios({
      method: "DELETE",
      url: `${BASE_URL}/stories/${storyId}`,
      data: { token }
    });
    
    // Rule out stories with different storyId 
    this.stories = this.stories.filter(s => s.storyId !== storyId);
    user.ownStories = user.ownStories.filter(s => s.storyId !== storyId); 
    user.favorites = user.favorites.filter(s => s.storyId !== storyId); 
  }
}
  
/* User: represents the current user */
class User {
  constructor({
                username,
                name,
                createdAt,
                favorites = [],
                ownStories = []
              },
              token) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    this.favorites = favorites.map(s => new Story(s)); // New Story instance for favorites
    this.ownStories = ownStories.map(s => new Story(s)); // New Story instance for ownStories

    this.loginToken = token;
  }

  // Register new user in API 
  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

    let { user } = response.data

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  //* Login in user with API 
  static async login(username, password) {
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  // Once we have credentials (token & username) for a user,log them in automatically
  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET", 
        params: { token },
      });

      let { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }

  // Add a favorite story to the API
  async addFavorite(story) {
    try {
      this.favorites.push(story); 
      const token = this.loginToken;

      await axios({
                url: `${BASE_URL}/users/${this.username}/favorites/${story.storyId}`,
                method: "POST",
                data: {token}
              });
      console.log("addfavorite");
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  }

  // Remove a favorite story from the API
  async removeFavorite(story) {
    try {
      this.favorites = this.favorites.filter(s => s.storyId !== story.storyId);
      const token = this.loginToken;

      await axios({
        url: `${BASE_URL}/users/${this.username}/favorites/${story.storyId}`,
        method: "DELETE",
        data: {token}
      });
      console.log("removeFavorite");
   
    } catch (error) {
      console.error("Error removing favorites", error);
    }
  }
}



