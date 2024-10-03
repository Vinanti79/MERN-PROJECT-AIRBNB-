const express=require("express");
const router=express.Router({mergeParams: true});
//to work review we have to require
const wrapAsync=require("../utilis/wrapAsync.js");
const ExpressError=require("../utilis/ExpressError.js");
const Review=require("../models/review.js");
const Listing =  require("../models/listing.js");    //listing model will get added to review.js becoz we add reviews in listing model.
const{validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js");

const reviewController=require("../controllers/reviews.js");


//create route for review:-Reviews
//Post route
router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview));

//delte review route
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview));

module.exports=router;
