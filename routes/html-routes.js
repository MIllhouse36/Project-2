// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");
const db = require("../models");

module.exports = function(app) {
  app.get("/", (req, res) => {
    // If the user already has an account send them to the members page
    const memberObject = {
      user: req.user
    };
    if (req.user) {
      // res.redirect("/members");
      res.render("members", memberObject);
    } else {
      res.render("signup");
    }
    // res.sendFile(path.join(__dirname, "../public/signup.html"));
  });

  app.get("/login", (req, res) => {
    const memberObject = {
      user: req.user
    };
    // If the user already has an account send them to the members page
    if (req.user) {
      // res.redirect("/members");
      res.render("members", memberObject);
    } else {
      // res.sendFile(path.join(__dirname, "../public/login.html"));
      res.render("login");
    }
  });

  app.get("/viewuser/:user", (req, res) => {
    db.Game.findAll({
      where: {
        user: req.params.user
      }
    }).then(data => {
      const gamesObject = {
        games: data
      };
      console.log(gamesObject);
      res.render("users", gamesObject);
      // res.send(data);
    });
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/members", isAuthenticated, (req, res) => {
    // res.sendFile(path.join(__dirname, "../public/members.html"));
    const memberObject = {
      email: req.user.email,
      city: req.user.city,
      state: req.user.state,
      zip: req.user.zip
    };
    // console.log(req.user);
    res.render("members", memberObject);
  });
};
