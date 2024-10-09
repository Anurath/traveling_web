const { required } = require("joi");
const Listing=require("./models/listing");
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to create listings");
        return res.redirect("/login");
      }
      next();
}

module.exports.isLoggedInReview=(req,res,next)=>{
  if(!req.isAuthenticated()){
      req.session.redirectUrl=req.originalUrl;
      req.flash("error","You must be logged in.");
      return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
}

// module.exports.isOwner=async(req,res,next)=>{
//   let listing=await Listing.findById(id);
//     if(currUser && !listing.owner._id.equals(res.locals.currUser._id)){
//       req.flash("error","You are not the owner of this listing.");
//       res.redirect(`/listings/${id}`);
//     }
// }

// module.exports.isReviewAuthor=async(req,res,next)=>{
//   let {id,reviewId}=req.params;
//   let listing = await Listing.findById(id);
//   if(!riview.author.equals(res.locals.currUser._id)){
//     req.flash("error","You are not review author.");
//     return res.redirect(`/listings/${id}`)
//   }
//   next();
// }