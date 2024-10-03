const mongoose = require("mongoose");//requir mongoose
const review = require("./review");
//define a variable for schema
const Schema = mongoose.Schema;
const Review=require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    description: String,
    image: {
    url: String,
    filename:String,
    },
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    Owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    /*category:{
    //     type:String,
    //    enum:["mountains","arctic","farms","deserts",""]
     }*/
});
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
    await Review.deleteMany({_id:{$in: listing.reviews}});
    }
});
//by using listing schema we made a model 
const Listing =  mongoose.model("Listing",listingSchema);
//export this model in app.js
module.exports = Listing;