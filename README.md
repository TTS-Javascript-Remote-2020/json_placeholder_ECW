# json_placeholder_ECW

try it live: https://tts-javascript-remote-2020.github.io/json_placeholder_ECW/

APIs, AJAX, and Promises homework

Using the API at http://jsonplaceholder.typicode.com/ create an app with the following functionality.

Use Promises for everything.

- Login page - Display a login form asking user for a username.

  - On Submit, look up the username entered by the user.
  - If no user is found, display a detailed error message.
  - If the user is found, store user object and render User's homepage

- User's homepage displays:

  - User's name
  - User's post titles
  - User's albums

- Post View - Clicking on a post renders a post view, including:

  - Post title
  - Post text
  - A list of comments on the post
  - A back link to the user homepage

- Album View - Clicking on an album renders the album page, including:

  - Thumbnails of all the photos and the photo's title
  - A search box that filters the photos by title as the user types
  - A back link to the user homepage

- TODO:

  - Add captions to thumbnails on Album View
  - Add error pages
  - Add back navigation buttons
  - Add filter feature to Album View
  - Add styles
