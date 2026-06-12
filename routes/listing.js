const express = require('express');
const router = express.Router();   
const wrapAsync = require("../utils/wrapAsync"); 
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner,validListing } = require("../middleware.js");

const listingsController = require("../controllers/listings.js");

//INDEX route
router.get("/",wrapAsync(listingsController.index)
);
 
//NEW route 
router.get("/new",isLoggedIn,listingsController.renderNewForm);
 
//SHOW route
router.get("/:id",wrapAsync(listingsController.showListing));

//Create route
router.post("/",
    isLoggedIn,
    validListing,
    wrapAsync(listingsController.createListing));

//Edit route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingsController.renderEditForm));

//Update route
router.put("/:id",
    isLoggedIn,
    isOwner,
    validListing,
    wrapAsync(listingsController.updateListing));

//DELETE route
router.delete("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(listingsController.deleteListing));

module.exports = router;