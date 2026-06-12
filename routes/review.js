const express = require('express');
const router = express.Router({mergeParams:true}); 
const wrapAsync = require("../utils/wrapAsync.js")
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

const reviewsController = require("../controllers/review.js");
const review = require('../models/review.js');

//Post Review route
router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewsController.postReview));
//Delete Review route
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewsController.deleteReview));

module.exports = router;