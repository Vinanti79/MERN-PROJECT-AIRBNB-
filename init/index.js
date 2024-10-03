const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

//to establish a connection
const MONGO_URL="mongodb://127.0.0.1:27017/Wanders";//this url is copied from mongoose page and stored in a variable
//to call main function
main()
    .then(()=>{
    console.log("connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    });
async function main(){
    await mongoose.connect(MONGO_URL);
}


//in init there iss a;redy data so clear it first
const initDB = async()=>{
    await Listing.deleteMany({}); 
    initData.data = initData.data.map((obj)=>({ ...obj, Owner: "66ee85688627b7b5bce4ecda"}));
    await Listing.insertMany(initData.data);
    //initData is a object in init
    console.log("data was initialized");
};

initDB();