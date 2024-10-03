if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
};


const express= require("express");  //express that we require here is a function that returns a value which value we stored in app
const app = express();   //app- object . that is actual app that we are building on server side
const mongoose= require("mongoose");
//const Listing =  require("./models/listing.js");
const path=require("path"); //to set ejs give path
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
//const wrapAsync=require("./utilis/wrapAsync.js");
const ExpressError=require("./utilis/ExpressError.js");
//const {listingSchema,reviewSchema}=require("./schema.js");
//const Review=require("./models/review.js");
const session=require("express-session");
const MongoStore=require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/User.js");

const listingRouter=require("./Routes/listing.js");       //require listings from listing.js
const reviewRouter=require("./Routes/reviews.js");        //require reviews from review.js-->Routes
const userRouter=require("./Routes/User.js");
const { Server } = require('http');

//connect database:
//const MONGO_URL="mongodb://127.0.0.1:27017/Wanders";//this url is copied from mongoose page and stored in a variable
const dbUrl=process.env.ATLASDB_URL;
//to call main function
main()
    .then(()=>{
    console.log("connected to DB");
    })
    .catch((err)=>{
        console.log("Failed to connect to DB",err);
    });
async function main(){
    await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use('/uploads',express.static(path.join(__dirname,'uploads')));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store=MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
       secret:process.env.SECRET
    },
    touchAfter:24 * 3600,
});

store.on("error",()=>{
    console.log("Error in MONGO SESSION STORE",err);
});

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUnitialized:true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};

//basic api
// app.get("/",(req,res)=>{
//     res.send("Hi,I am root");
// });


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//create demo user:-
// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });

//     let registeredUser=await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })

//middleware for flash msg
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user || null;
    next();
});
app.use("/listings",listingRouter);
app.use("/listings/:id/review",reviewRouter);
app.use("/",userRouter);

//if the page that we want is not found then for error "page not found" then,
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found..."));
});
//custom error handler at server side
app.use((err,req,res,next)=>{
    //res.send("Something went wrong..!");
    let{statusCode=500,message="Something went wrong!"}=err;
    console.error(err.message);
    //res.status(500).send("Something went wrong..!");
    //res.status(statusCode).send(message);
    res.status(statusCode).render("errors.ejs",{err});
});

//server start on port 8080
app.listen(8080, ()=>{
    console.log("server is listening to port 8080");
});

