const express = require('express');
const router = express.Router();   
const wrapAsync = require("../utils/wrapAsync"); 
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner,validListing } = require("../middleware.js");

const listingsController = require("../controllers/listings.js");

//index route and create route
router.route("/")
 .get(wrapAsync(listingsController.index))
 .post(
    isLoggedIn,
    validListing,
    wrapAsync(listingsController.createListing)
);

//NEW route 
router.get("/new",isLoggedIn,listingsController.renderNewForm);


//show route and update route and delete route
router.route("/:id")
    .get( wrapAsync(listingsController.showListing))
    .put(
    isLoggedIn,
    isOwner,
    validListing,
    wrapAsync(listingsController.updateListing))
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingsController.deleteListing)
    );
    
//Edit route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingsController.renderEditForm));

module.exports = router;