const url = "https://jsonplaceholder.typicode.com/";

// function clear_response() {
//   $("#response").html("");
// }

function clear_container() {
  $("#container").html("");
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

function getUserByUsername(username) {
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
        resolve(posts);
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
      if (photos.length) {
        resolve(photos);
      } else {
        reject("No photos found for albumId: " + albumID);
      }
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

function renderPosts(posts) {
  $("#loading-posts").remove();
  const postsHeader = "<h2>Your Posts</h2>";
  $("#posts").append(postsHeader);
  const ul = "<ul id='posts-list'></ul>";
  $("#posts").append(ul);
  posts.forEach(function (post) {
    const li =
      "<li><a href='#' id='" +
      post.id +
      "' class='post-link'>" +
      post.title +
      "</a></li>";
    $("#posts-list").append(li);
  });
  $("a.post-link").on("click", function (event) {
    const postID = event.target.id;
    renderPostPage(postID);
    event.preventDefault();
  });
}

function renderAlbums(albums) {
  $("#loading-albums").remove();
  const albumsHeader = "<h2>Your Albums</h2>";
  $("#albums").append(albumsHeader);
  const ul = "<ul id='albums-list'></ul>";
  $("#albums").append(ul);
  albums.forEach(function (album) {
    const li =
      "<li><a href='#' id = '" +
      album.id +
      "' class='album-link'>" +
      album.title +
      "</a></li>";
    $("#albums-list").append(li);
  });
  $("a.album-link").on("click", function (event) {
    const albumID = event.target.id;
    renderAlbumPage(albumID);
    event.preventDefault();
  });
}

function renderPostPage(postID) {
  getPostByID(postID)
    .catch(handleGetPostsError)
    .then(renderPost)
    .then(getComments)
    .catch(handleCommentsError)
    .then(renderComments);
}

function renderAlbumPage(albumID) {
  getAlbumByID(albumID).then(renderAlbumTitle);
  getPhotosByAlbumID(albumID).catch(handleGetPhotosError).then(renderPhotos);
}

function renderAlbumTitle(album) {
  $("h1").text(album.title);
}

function renderPhotos(photos) {
  const ul = "<ul id='photos-list'></ul>";
  clear_container();
  $("#container").append(ul);
  photos.forEach(function (photo) {
    const img =
      "<a href='" + photo.url + "'><img src='" + photo.thumbnailUrl + "'/></a>";
    $("#photos-list").append(img);
  });
}

function renderPost(post) {
  $("h1").text(post.title);
  clear_container();
  const body = "<p class='card body'>" + post.body + "</p>";
  $("#response").append(body);
  return new Promise(function (resolve, reject) {
    resolve(post.id);
  });
}

function renderComments(comments) {
  console.log(comments);
}

async function renderHomePage(user) {
  $("#container").append("<div id='posts' class='card'></div>");
  $("#container").append("<div id='albums' class='card'></div>");
  getPostsByUser(user).then(renderPosts);
  getAlbumsByUser(user).catch(handleGetAlbumsError).then(renderAlbums);
}

function displayHomepageLoadingMessages(user) {
  $("h1").text("Welcome, " + user.name);
  $("#response").html(
    "<h3 id='loading-posts' class='loading'>Loading Posts...</h3><h3 id='loading-albums' class='loading'>Loading Albums...</h3>"
  );
  return new Promise(function (resolve, reject) {
    resolve(user);
  });
}

function login() {
  const username = $("#username").val();
  $("#response").html("<h3 class='loading'>Logging in...</h3>");
  getUserByUsername(username)
    .catch(handleUsernameError)
    .then(displayHomepageLoadingMessages)
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
