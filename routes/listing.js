const express = require('express');
const router = express.Router();   
const wrapAsync = require("../utils/wrapAsync"); 
const { listingSchema,reviewSchema } = require("../schema.js");   
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");

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
router.get("/listings",wrapAsync(async (req,res)=>{
    const alllistings = await Listing.find({});
     res.render("listings/index.ejs",{alllistings});
}));
 
//NEW route 
router.get("/listings/new",(req,res)=>{
     res.render("listings/new.ejs")
});
 
//SHOW route
router.get("/listings/:id",wrapAsync(async (req,res)=>{
     let {id}=req.params;
     const listing = await Listing.findById(id).populate("reviews");
     res.render("listings/show.ejs",{listing})
}));

//Create route
router.post("/listings",
    validListing,
    wrapAsync(async (req,res,next)=>{
    const newListing= new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    console.log(req.body); 
}));

//Edit route
router.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let{id} =req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//Update route
router.put("/listings/:id",
    validListing,
    wrapAsync(async(req,res)=>{
    let{id} =req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
}));
//DELETE route
router.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let{ id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id)
    console.log(deletedListing);
    res.redirect("/listings");
}));

module.exports = router;