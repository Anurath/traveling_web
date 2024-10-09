const Listing=require("../models/listing.js");
const Review=require("../models/reviews.js");
module.exports.reviewRouteRoute= async(req,res,next)=>{
    try{
      let {id}=req.params;
      let listing=await Listing.findById(req.params.id);
      let newReview=await new Review(req.body.review);
      newReview.author=req.user._id;
      await listing.reviews.push(newReview);
      
    await newReview.save();
    await listing.save();
    req.flash("success","Review added successfully!");
    res.redirect(`/listings/${listing._id}`);
    }catch(err){
      next(new ExpressError(400,err));
    }
  };

module.exports.destroyReviewRoute= async(req,res,next)=>{
    try{
      let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted successfully!");
    res.redirect(`/listings/${id}`);
    }catch(err){
      next(new ExpressError(400,err));
    }
  };