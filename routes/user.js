const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userControllers = require("../controllers/user.js");
const user = require("../models/user.js");

//1. sign up route
router
  .route("/signup")
  .get((req, res) => {
  res.render("users/signup.ejs");
  })
  .post(userControllers.signup);

//2. login route
router
  .route("/login")
  .get( (req, res) => {res.render("users/login.ejs")})
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userControllers.login
  );

//3. log out route
router.get("/logout", userControllers.logout);

module.exports = router;
