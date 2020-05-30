function login(event) {
  const username = $("#username").val();
  const url = "http://jsonplaceholder.typicode.com/";
  $.get(url + "users?username=" + username, function (data) {
    renderHomepage(data);
  });
}

function renderHomepage(data) {
  let page = "";
  $("#container").html("");
  console.log(data);
  $("h1").text("Your data has been logged");
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
