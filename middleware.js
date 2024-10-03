const Listing=require("./models/listing");
const Review=require("./models/review");
const ExpressError=require("./utilis/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        //redirecturl save
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to create listings!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async(req,res,next)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.Owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//to write joi validation schema's using middleware
module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(405,errMsg);
    }else{
        next();
    }
};

// //to validate review
module.exports.validateReview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

module.exports.isReviewAuthor=async(req,res,next)=>{
    let{id, reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.Author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review.");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
