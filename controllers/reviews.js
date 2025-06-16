const Review = require("../models/reviews.js");
const Listing = require("../models/listing");

module.exports.createReview = async (req, res) => {
  let { id } = req.params; // Get the listing ID from the URL
  let listing = await Listing.findById(id); // Find the listing in the DB

  let newReview = new Review(req.body.review); // Create new review from form data

  listing.reviews.push(newReview); // Add review to the listing's reviews array

  await newReview.save(); // Save the review
  await listing.save();   // Save the updated listing

  res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReviews = async (req, res) => {
    let { id, reviewId } = req.params;

    // Remove the review reference from the listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the actual review document
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}