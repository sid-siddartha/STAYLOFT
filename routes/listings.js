const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js"); // Make sure this exists and is valid
const { isLoggedIn } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

//validate listing
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};


//3Index Route   "/listings"
//6 create route post req   "/listings"
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"), //middleware
    validateListing,
    wrapAsync(listingController.createListing)
  );

//5 Create Route    "/listings/new"
router.get("/new", isLoggedIn, listingController.renderNewForm);

//4Show route   "/listings/:id"
//8 Update Route        "/listings/:id"
//9 DELETE route        "/listings/:id"
router
  .route("/:id")
  .get(wrapAsync(listingController.showLisitng))
  .put(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isLoggedIn,
    wrapAsync(listingController.destroyLisitng)
  );

router.get('/listings', async (req, res) => {
  const { search } = req.query;
  let allListings;

  if (search) {
    // Case-insensitive search using regex
    allListings = await Listing.find({
      title: { $regex: search, $options: 'i' }
    });
  } else {
    allListings = await Listing.find({});
  }

  res.render('listings/index', { allListings }); // or your actual view
});




//7 Edit Route      "/listings/:id/edit"
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
