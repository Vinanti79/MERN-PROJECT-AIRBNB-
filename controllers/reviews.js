const Listing=require("../models/listing");
const Review=require("../models/review");

module.exports.createReview=async(req,res)=>{
    console.log(req.params.id);     //it will print id at server side when we do reviews in listing.
    let listing=await  Listing.findById(req.params.id);
    //create a new review
    let newReview=new Review(req.body.review);
    newReview.Author=req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    //console.log("new review saved");
    //res.send("new review send");
    req.flash("success","New Review Created");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview=async(req,res)=>{
    let {id, reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success"," Review Deleted");
    res.redirect(`/listings/${id}`);
};