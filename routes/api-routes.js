// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");
const axios = require("axios");
const igdbApiKey = process.env.IGDB_API_KEY;

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id
    });
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", (req, res) => {
    db.User.create({
      email: req.body.email,
      password: req.body.password,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip
    })
      .then(() => {
        res.redirect(307, "/api/login");
      })
      .catch(err => {
        // res.status(401).json(err);
        console.log(err);
      });
    console.log(req.body);
  });

  app.post("/api/addgame", (req, res) => {
    db.Game.create({
      title: req.body.title,
      summary: req.body.summary,
      user: req.body.user,
      platform: req.body.platform
    })
      .then(() => {
        res.redirect("/members");
      })
      .catch(err => {
        // res.status(401).json(err);
        console.log(err);
      });
    console.log(req.body);
  });

  app.post("/api/deletegame", (req, res) => {
    db.Game.destroy({
      where: {
        title: req.body.title
      }
    })
      .then(() => {
        res.redirect("/members");
      })
      .catch(err => {
        // res.status(401).json(err);
        console.log(err);
      });
    console.log(req.body);
  });

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  app.get("/api/search/:query", (req, res) => {
    const query = req.params.query;
    const split = query.split("xxxxx");
    const platform = split[0];
    const search = decodeURIComponent(split[1]);
    console.log(search);
    axios({
      url: "https://api-v3.igdb.com/games",
      method: "GET",
      headers: {
        Accept: "application/json",
        "user-key": igdbApiKey
      },
      data: `
      search "${search}";
      f name,summary,platforms;
      w platforms = (${platform});
      `
    })
      .then(response => {
        console.log(response.data);
        return res.json(response.data);
      })
      .catch(err => {
        console.error(err);
      });
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  app.get("/api/view/:user", (req, res) => {
    // return everything in the games table
    const userName = req.params.user;
    db.Game.findAll({
      where: {
        user: userName
      }
    }).then(data => {
      res.send(data);
    });
  });
};
