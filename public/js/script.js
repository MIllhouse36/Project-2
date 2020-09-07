$(document).ready(() => {
  console.log("Scripts are running");
  // Getting references to our form and inputs
  const loginForm = $("form.login");
  const emailInput = $("input#email-input");
  const passwordInput = $("input#password-input");
  const signUpForm = $("form.signup");
  const cityInput = $("input#city-input");
  const stateInput = $("#state-input");
  const zipInput = $("input#zip-input");

  // When the form is submitted, we validate there's an email and password entered
  loginForm.on("submit", event => {
    event.preventDefault();
    const userData = {
      email: emailInput.val().trim(),
      password: passwordInput.val().trim()
    };

    if (!userData.email || !userData.password) {
      return;
    }

    // If we have an email and password we run the loginUser function and clear the form
    loginUser(userData.email, userData.password);
    emailInput.val("");
    passwordInput.val("");
  });

  // loginUser does a post to our "api/login" route and if successful, redirects us the the members page
  function loginUser(email, password) {
    $.post("/api/login", {
      email: email,
      password: password
    })
      .then(() => {
        window.location.replace("/members");
        // If there's an error, log the error
      })
      .catch(err => {
        console.log(err);
      });
  }

  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", event => {
    event.preventDefault();
    const userData = {
      email: emailInput.val().trim(),
      password: passwordInput.val().trim(),
      city: cityInput.val().trim(),
      state: stateInput.find(":selected").val(),
      zip: zipInput.val().trim()
    };
    if (
      !userData.email ||
      !userData.password ||
      !userData.city ||
      !userData.state ||
      !userData.zip
    ) {
      handleLoginErr();
      return;
    }
    // If we have an email and password, run the signUpUser function
    signUpUser(userData);
    emailInput.val("");
    passwordInput.val("");
    cityInput.val("");
    zipInput.val("");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(data) {
    $.post("/api/signup", data)
      .then(() => {
        window.location.replace("/members");
        // If there's an error, handle it by throwing up a bootstrap alert
      })
      .catch(handleLoginErr);
  }

  function handleLoginErr() {
    $("#alert .msg").text("Error");
    $("#alert").fadeIn(500);
    // $("#exampleModal").modal("show");
  }

  $.get("/api/user_data").then(data => {
    $(".member-name").text(data.email);
  });

  $("#search-title").on("click", () => {
    const search = $("#title-search").val();
    const platform = $("#platforms")
      .find(":selected")
      .val();
    const url = platform + "xxxxx" + encodeURIComponent(search);
    $("#output").empty();
    $.get("/api/search/" + url, data => {
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        const html = `
          <div class="search-container">
          <h3>${data[i].name}</h3>
          <p>${data[i].summary}</p>
          <button class="btn btn-glass" id='add-game'">Add Game</button>
      <button class="btn btn-glass" id='find-game'">Find Game</button>
        <br></br>
          </div>
          `;
        //console.log(html);
        $("#output").append(html);
      }
    });

    $(document).on("click", "#add-game", event => {
      const gameTitle = event.target.parentElement.children[0].outerText;
      const gameSummary = event.target.parentElement.children[1].outerText;
      const userData = $("#user-email").text();
      const gamePlatform = $("#platforms")
        .find(":selected")
        .text();
      const newGame = {
        title: gameTitle,
        summary: gameSummary,
        user: userData,
        platform: gamePlatform
      };
      $.post("/api/addgame", newGame)
        .then(() => {
          location.reload();
        })
        .catch(handleLoginErr);
    });

    $(document).on("click", "#find-game", event => {
      const gameTitle = encodeURIComponent(
        event.target.parentElement.children[0].outerText
      );
      console.log(gameTitle);
      $("#output").empty();
      $.get("/api/findgame/" + gameTitle, data => {
        console.log(data);
        for (let i = 0; i < data.length; i++) {
          const usershtml = `
          <div class="search-container">
          <a href="/users/${data[i].user}" target="_blank">${data[i].user}</a>
          </div>
          `;
          //console.log(html);
          $("#output").empty();
          $("#output").append(usershtml);
        }
        $("#output").prepend(
          `<h4>List of users who have <strong>${decodeURIComponent(
            gameTitle
          )}</strong>:</h4>`
        );
      })
        .then(() => {
          //		location.reload();
        })
        .catch(handleLoginErr);
    });
  });

  $("#view-collection").on("click", event => {
    event.preventDefault;
    $("#output").empty();
    const user = $("#user-email").text();
    outputCollection(user);
  });

  $(document).on("click", "#delete-game", event => {
    event.preventDefault;
    const gameTitle = event.target.parentElement.children[0].outerText;
    const gameSummary = event.target.parentElement.children[2].outerText;
    const userData = $("#user-email").text();
    const game = {
      title: gameTitle,
      summary: gameSummary,
      user: userData
    };
    $.post("/api/deletegame", game)
      .then(() => {
        location.reload();
      })
      .catch(handleLoginErr);
  });

  $(document).on("click", ".lookup-user", event => {
    event.preventDefault;
    const user = event.target.innerHTML.trim();
    console.log(event.target);
    $.get("/viewuser/" + user, data => {
      console.log(data);
      $(".modal-body").empty();
      $(".modal-body").html(data);
    });
  });

  function outputCollection(user) {
    $.get("/api/view/" + user, data => {
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        const html = `
                <div class="search-container">
                <h3>${data[i].title}</h3>
                <p>Platform: ${data[i].platform}</p>
                <p>Summary: ${data[i].summary}</p>
                <button class="btn btn-glass" id='delete-game'">Delete Game</button>
                <br></br>
                </div>
                `;
        $("#output").prepend(html);
      }
      $("#output").prepend("<h4>Your Collection:</h4>");
    });
  }

  $("#username-output").text($("#username-input").text());
  $(".username-input").css("display", "none");
  $("#contact-email").attr("href", "mailto:" + $("#username-input").text());
  const username = $("#username-input").text();
  $.get("/api/userinfo/" + username).then(data => {
    $("#location-info").text(
      data[0].city + ", " + data[0].state + " " + data[0].zip
    );
  });

  // Load the collection when the page loads
  const user = $("#user-email").text();
  outputCollection(user);
});
