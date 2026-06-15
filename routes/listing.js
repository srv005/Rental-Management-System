const express = require('express');
const router = express.Router();   
const wrapAsync = require("../utils/wrapAsync"); 
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner,validListing } = require("../middleware.js");
const listingsController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


//index route and create route
router.route("/")
 .get(wrapAsync(listingsController.index))
 .post(
    isLoggedIn,
    upload.single('listing[image]'),
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