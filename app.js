if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const dbUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
  mongoUrl : dbUrl,
  crypto : {
    secret : process.env.SECRET,
  },
  touchAfter : 24 * 3600,
});

store.on("error",()=>{
  console.log("Error in Mongo session store");
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  //cookie expire
  cookie : {
    expires : Date.now() + 7*24*60*60*1000,
    //7 days millisecond we have to represent in the milliseconds
    maxAge : 7*24*60*60*1000,
    httpOnly : true,
  }
};




// EJS Setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("views/assets"));

//mongoose connect
const mongoose = require("mongoose");
const { log } = require("console");


main()
  .then(() => {
    console.log("Connection Successfull!");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(dbUrl);
}

//1first page
app.get("/", (req, res) => {
  res.redirect("/listings");
});

//11 validating the listing using middleware
const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else
    {
        next();
    }
}

//14 Validate the review using middleware
const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else
    {
        next();
    }
}

//2Test Listing
// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title : "My Home",
//         description : "By the Beach",
//         price : 1200,
//         location : "hyderabad",
//         country : "India",
//     });

//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Succuessfull testing");
// });
 
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/demouser",async (req,res)=>{
//   let fakeUser = new User({
//     email :  "student@st.com",
//     username : "student9"
//   });

//   let registeredUser = await User.register(fakeUser,"helloWorld");   
//   res.send(registeredUser);
  //user.regi(userobject,password);
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);

//all the incoming requests i.e *
// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, " page not found"));
// });

//10
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});


//listening
app.listen(8080, () => {
  console.log("App is listening to port 8080");
});
