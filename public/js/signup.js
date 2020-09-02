$(document).ready(() => {
  // Getting references to our form and input
  const signUpForm = $("form.signup");
  const emailInput = $("input#email-input");
  const passwordInput = $("input#password-input");
  const cityInput = $("input#city-input");
  const stateInput = $("#state-input");
  const zipInput = $("input#zip-input");

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
    const data = {
      search: $("#title-search")
        .val()
        .trim()
    };
    $.post("/api/signup", data)
      .then(() => {
        window.location.replace("/members");
        // If there's an error, handle it by throwing up a bootstrap alert
      })
      .catch(handleLoginErr);
    if (
      !userData.email ||
      !userData.password ||
      !userData.city ||
      !userData.state ||
      !userData.zip
    ) {
      return;
      // todo: Add error "Empty form fields"
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

  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});
