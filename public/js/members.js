$(document).ready(() => {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(data => {
    $(".member-name").text(data.email);
  });
  $("#search-title").on("click", () => {
    const search = $("#title-search").val();
    const url = encodeURIComponent(search);

    $.get("/api/search/" + url, data => {
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        $("#output").append(data[i]);
      }
    });
  });
});
