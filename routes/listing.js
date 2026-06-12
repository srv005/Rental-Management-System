const express = require('express');
const router = express.Router();   
const wrapAsync = require("../utils/wrapAsync"); 
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner,validListing } = require("../middleware.js");


//INDEX route
router.get("/",wrapAsync(async (req,res)=>{
    const alllistings = await Listing.find({});
     res.render("listings/index.ejs",{alllistings});
}));
 
//NEW route 
router.get("/new",isLoggedIn,(req,res)=>{
     res.render("listings/new.ejs")
});
 
//SHOW route
router.get("/:id",wrapAsync(async (req,res)=>{
     let {id}=req.params;
     const listing = await Listing.findById(id)
     .populate({
        path:"reviews",
        populate:{
            path:"author"
        },
     })
     .populate("owner");
     if(!listing){
        req.flash("error","Listing does not exist!");
        return res.redirect("/listings");
     }
     res.render("listings/show.ejs",{listing})
}));

//Create route
router.post("/",
    isLoggedIn,
    validListing,
    wrapAsync(async (req,res,next)=>{
    const newListing= new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","Successfully made a new listing");
    res.redirect("/listings");
}));

//Edit route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req,res)=>{
    let{id} =req.params;
    const listing = await Listing.findById(id);
        if(!listing){
            req.flash("error","listing does not exist!");
            return res.redirect("/listings");
        }
    res.render("listings/edit.ejs",{listing});
}));

//Update route
router.put("/:id",
    isLoggedIn,
    isOwner,
    validListing,
    wrapAsync(async(req,res)=>{
    let{id} =req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Successfully updated the listing!");   
    res.redirect("/listings");
}));
//DELETE route
router.delete("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req,res)=>{
    let{ id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id)
    console.log(deletedListing);
    req.flash("success","Successfully deleted the listing!");
    res.redirect("/listings");
}));

module.exports = router;