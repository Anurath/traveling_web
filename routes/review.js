const express = require('express');
const router = express.Router({mergeParams:true});

router.use(express.urlencoded({extended:true}));
const ExpressError=require("../utils/ExpressError");
const Listing=require("../models/listing.js");
const Review=require("../models/reviews.js");


//create new reviews route
router.post("/",async(req,res,next)=>{
    try{
      let {id}=req.params;
      let listing=await Listing.findById(req.params.id);
      let newReview=await new Review(req.body.review);
      await listing.reviews.push(newReview);
  
    await newReview.save();
    await listing.save();
  
    res.redirect(`/listings/${listing._id}`);
    }catch(err){
      next(new ExpressError(400,err));
    }
  })
  
  //delete reviews route
  router.delete("/:reviewId",async(req,res,next)=>{
    try{
      let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
    }catch(err){
      next(new ExpressError(400,err));
    }
  });

  module.exports=router;
  