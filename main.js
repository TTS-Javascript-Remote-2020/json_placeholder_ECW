const url = "https://jsonplaceholder.typicode.com/";

function clear() {
  $("#container").html("");
  $("#response").html("");
}

function handleUsernameError(error) {
  console.warn(error, "sending sample User");
  return {
    id: 9999,
    name: "Elliott Woodward",
    username: "Sample User",
  };
}

function handleGetPostsError(error) {
  console.warn(error, "sending sample Posts");
  return [
    {
      userId: 9999,
      id: 9999,
      title: "Sample Post One",
      body:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor, eligendi quisquam sit nam unde reiciendis cumque fuga aut explicabo nobis molestiae voluptate et non aliquam eius. Illo nulla eaque optio?",
    },
    {
      userId: 9999,
      id: 9998,
      title: "Sample Post Two",
      body:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor, eligendi quisquam sit nam unde reiciendis cumque fuga aut explicabo nobis molestiae voluptate et non aliquam eius. Illo nulla eaque optio?",
    },
  ];
}

function handleGetAlbumsError(error) {
  console.warn(error, "sending sample Albums");
  return [
    {
      userId: 9999,
      id: 9999,
      title: "Sample Album One",
    },
    {
      userId: 9999,
      id: 9998,
      title: "Sample Album Two",
    },
  ];
}

function handleCommentsError(error) {
  console.warn(error, "sending sample Comments");
  return [
    {
      postId: 9999,
      id: 9999,
      name: "John Doe",
      email: "john.doe@json.api",
      body:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit esse amet iusto aliquid, corrupti laborum? Explicabo, deserunt! Possimus, tenetur quod?",
    },
    {
      postId: 9999,
      id: 9998,
      name: "Jane Doe",
      email: "jane.doe@json.api",
      body:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit esse amet iusto aliquid, corrupti laborum? Explicabo, deserunt! Possimus, tenetur quod?",
    },
  ];
}

function handleGetPhotosError(error) {
  console.warn(error, "sending sample Photos");
  return [
    {
      albumId: 9999,
      id: 9999,
      title: "Sample Photo One",
      url: "",
      thumbnailUrl: "",
    },
    {
      albumId: 9999,
      id: 9998,
      title: "Sample Photo Two",
      url: "",
      thumbnailUrl: "",
    },
  ];
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

function getAlbumsByUser(user) {
  return new Promise(function (resolve, reject) {
    $.get(url + "users/" + user.id + "/albums", function (albums) {
      if (albums.length) {
        resolve(albums);
      } else {
        reject("No albums found for userId: " + user.id);
      }
    });
  });
}

function getPostByID(postID) {
  return new Promise(function (resolve, reject) {
    $.get(url + "posts/" + postID, function (post) {
      resolve(post);
    });
  });
}

function getAlbumByID(albumID) {
  return new Promise(function (resolve, reject) {
    $.get(url + "albums/" + albumID, function (album) {
      resolve(album);
    });
  });
}

function getPhotosByAlbumID(albumID) {
  return new Promise(function (resolve, reject) {
    $.get(url + "albums/" + albumID + "/photos", function (photos) {
      resolve(photos);
    });
  });
}

function getComments(postID) {
  return new Promise(function (resolve, reject) {
    $.get(url + "comments?postId=" + postID, function (comments) {
      if (comments.length) {
        resolve(comments);
      } else {
        reject("No comments found for postId: " + postID);
      }
    });
  });
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

function renderPostPage(postID) {
  getPostByID(postID)
    .catch(handleGetPostsError)
    .then(renderPost)
    .then(getComments)
    .then(renderComments);
}

function renderAlbumPage(albumID) {
  const albumPromise = getAlbumByID(albumID);
  const photosPromise = getPhotosByAlbumID(albumID);
  Promise.all([albumPromise, photosPromise]).then(funtion (results) {
    renderAlbum(results);
  });
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

function renderAlbum([album, photos]) {
  $("h1").text(album.title);
}

function renderComments(comments) {
  console.log(comments);
}

function login() {
  const username = $("#username").val();
  getUserByName(username)
    .catch(handleUsernameError)
    .then(getPostsByUser)
    .then(renderHomePage);
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
