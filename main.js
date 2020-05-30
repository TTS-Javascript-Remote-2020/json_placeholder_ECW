const url = "https://jsonplaceholder.typicode.com/";

function clear() {
  $("#container").html("");
  $("#response").html("");
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
  clear();
  $("#response").html("<h2>Loading posts...</h2>");
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

function handleGetPostError(error) {
  console.warn(error);
  return {
    id: 9999,
    title: "Sample Post",
    body:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor, eligendi quisquam sit nam unde reiciendis cumque fuga aut explicabo nobis molestiae voluptate et non aliquam eius. Illo nulla eaque optio?",
  };
}

function getPostByID(postID) {
  return new Promise(function (resolve, reject) {
    $.get(url + "posts/" + postID, function (post) {
      resolve(post);
    });
  });
}

function login() {
  const username = $("#username").val();
  getUserByName(username)
    .catch(handleUsernameError)
    .then(getPostsByUser)
    .then(renderHomePage);
}

function renderPost(post) {
  // console.log(post);
  $("h1").text(post.title);
  clear();
  const body = "<p class='card'>" + post.body + "</p>";
  $("#response").append(body);
  return new Promise(function (resolve, reject) {
    resolve(post.id);
  });
}

function getComments(postID) {
  return new Promise(function (resolve, reject) {
    $.get(url + "comments?postId=" + postID, function (comments) {
      resolve(comments);
    });
  });
}

function renderComments(comments) {
  console.log(comments);
}

function renderPostPage(postID) {
  getPostByID(postID)
    .catch(handleGetPostError)
    .then(renderPost)
    .then(getComments)
    .then(renderComments);
}

function renderHomePage([user, posts]) {
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
  $("a").each(function () {
    const self = this;
    // console.log(index + ": " + $(this).text());
    $(self).on("click", function (event) {
      const postID = event.target.id;
      renderPostPage(postID);
      event.preventDefault();
    });
  });
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
