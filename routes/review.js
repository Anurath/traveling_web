const express = require('express');
const router = express.Router({mergeParams:true});

router.use(express.urlencoded({extended:true}));
const ExpressError=require("../utils/ExpressError");
const Listing=require("../models/listing.js");
const Review=require("../models/reviews.js");
const {isLoggedIn,isLoggedInReview}=require("../middleware.js");

const reviewController=require("../controller/reviews.js");

//create new reviews route
router.post("/",isLoggedInReview,reviewController.reviewRouteRoute);
  
  //delete reviews route
  router.delete("/:reviewId",isLoggedInReview,reviewController.destroyReviewRoute);

  module.exports=router;
  