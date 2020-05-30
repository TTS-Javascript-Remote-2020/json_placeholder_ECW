const url = "https://jsonplaceholder.typicode.com/";

function clear() {
  $("#container").html("");
}

function getUserByName(username) {
  return new Promise(function (resolve, reject) {
    $.get(url + "users?username=" + username, function (users) {
      $("h1").text("Welcome, " + users[0].name);
      if (users.length) {
        resolve(users[0]);
      } else {
        reject("No user found with username: " + username);
      }
    });
  });
}

function getPostsByUser(user) {
  return new Promise(function (resolve, reject) {
    $.get(url + "posts?userId=" + user.id, function (posts) {
      if (posts.length) {
        resolve([user, posts]);
      } else {
        reject("No posts found for userId: " + user.id);
      }
    });
  });
}

function handleUsernameError(error) {
  console.warn(error, "using id=1 instead");
  return {
    username: "Sample User",
    id: 9999,
  };
}

function login() {
  const username = $("#username").val();
  getUserByName(username)
    .catch(handleUsernameError)
    .then(getPostsByUser)
    .then(renderHomepage);
}

function renderHomepage([user, posts]) {
  $("h1").text("Welcome, " + user.name);
  clear();
  const listHeader = "<h2>Your Posts</h2>";
  $("#response").append(listHeader);
  const ul = "<ul></ul>";
  $("#response").append(ul);
  posts.forEach(function (post) {
    const li =
      "<li><a href='#' id='" +
      post.id +
      "' class='post-link'>" +
      post.title +
      "</a></li>";
    $("ul").append(li);
  });
  console.log(user);
  console.log(posts);
}

$(document).ready(function () {
  $("#username")
    .focus(function () {
      $(this).attr("placeholder", "");
    })
    .blur(function () {
      $(this).attr("placeholder", "Johndoe");
    })
    .val("");

  $("#submit").click(function (event) {
    event.preventDefault();
    login();
  });
});
