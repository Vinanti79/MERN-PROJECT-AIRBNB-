const Listing=require("../models/listing");
const { listingSchema } = require("../schema");

module.exports.index=async(req,res)=>{              
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
         
  };

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing=async(req,res)=>{
    let{id} = req.params;
    const listing = await  Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"Author"
        },
    })
    .populate("Owner");
    if(!listing){
        req.flash("error","Listing does not exists!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing}); //to render all details about location.
};

module.exports.createListing=async(req,res)=>{
    //let(title, description, image, price,country , location)=req.body; insted of writing like this we write object with keyvalue like listing[title].
    //let listing=req.body.listing; //bcoz of this if we enter new data by clicking on add button data get added in the form of js object key value pair
    let url=req.file.path;
    let filename=req.file.filename;
    //console.log(url,"..",filename);
    //console.log(newListing.image.url);
    const newListing = new Listing(req.body.listing);
    newListing.Owner=req.user._id;
    newListing.image={
        url,
        filename
    };
    // if(req.file){
    //     newListing.image=req.file.path;
    // }
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
    };

module.exports.renderEditForm=async(req,res)=>{
    let{id} =  req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exists");
        res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_300");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing=async (req,res)=>{
    let{id}=req.params;
    
    let listing=await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file!== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    console.log(deletedListing);
    res.redirect("/listings");
};