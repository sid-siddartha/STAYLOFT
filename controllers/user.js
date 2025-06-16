const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");


module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      } else {
        req.flash("success", "welcome to stayloft");
        res.redirect("/listings");
      }
    });
  } catch {
    req.flash("error", "the User name has already been exist");
    res.redirect("/signup");
  }
}

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to Stayloft");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next();
    }
    req.flash("success", "You are logged out");
    res.redirect("/login");
  });
}