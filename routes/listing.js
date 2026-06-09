const express = require('express');
const router = express.Router();   
const wrapAsync = require("../utils/wrapAsync"); 
const { listingSchema} = require("../schema.js");   
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");

const validListing = (req,res,next)=>{ 
    let { error } = listingSchema.validate(req.body);

    if(error){
        let msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

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
     const listing = await Listing.findById(id).populate("reviews");
     if(!listing){
        req.flash("error","Listing does not exist!");
        return res.redirect("/listings");
     }
     res.render("listings/show.ejs",{listing})
}));

//Create route
router.post("/listings",
    isLoggedIn,
    validListing,
    wrapAsync(async (req,res,next)=>{
    const newListing= new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","Successfully made a new listing");
    res.redirect("/listings");
}));

//Edit route
router.get("/:id/edit",isLoggedIn,wrapAsync(async (req,res)=>{
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
    validListing,
    wrapAsync(async(req,res)=>{
    let{id} =req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Successfully updated the listing!");   
    res.redirect("/listings");
}));
//DELETE route
router.delete("/:id",isLoggedIn,wrapAsync(async (req,res)=>{
    let{ id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id)
    console.log(deletedListing);
    req.flash("success","Successfully deleted the listing!");
    res.redirect("/listings");
}));

module.exports = router;