const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js"); // Make sure this exists and is valid
const reviewController = require("../controllers/reviews.js");

//14 Validate the review using middleware
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//12 REVIEWS
//POST ROUTE
//we are creatong any seperate routes for review coz we dont see revies in sepereate page
router.post("/", validateReview, wrapAsync(reviewController.createReview));

//13 delete review route        "/listings/:id/reviews/:reviewId"
router.delete("/:reviewId",
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
