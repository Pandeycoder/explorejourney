
if(process.env.NODE_ENV != "production")
{
    require("dotenv").config();

}



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore=require("connect-mongo");

const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

// const stringify = require('json-stringify');



const listingRouter=require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { request } = require("http");


// const MONGO_URL = "mongodb://localhost:27017/explorejurney";
const dbUrl=process.env.ATLASDB_URL;

main()
    .then((res) => {
        console.log("connect db");
    }).catch((err) => {
        console.log(err.errors);

    });
async function main() {
    mongoose.connect(dbUrl); //here also dbUrl
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); //for put or patch request
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//----------------create session for 7 days working-----------------

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,

});

store.on("error",()=>{
    console.log("Error in Mongo Store",err);
})

const ssessionOptions={
     store, 
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};







app.use(session(ssessionOptions));
app.use(flash());


//--------------------user created--------------------------

app.use(passport.initialize());
app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
passport.use(new LocalStrategy({
    usernameField: 'email'
}, User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//-------------------------It is use for listing created time show messsage -------------
app.use((req,res,next)=>{

    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentUser=req.user;
    next();
});






//-------------------routes added    .......................

app.use("/",listingRouter);

app.use("/listing/:id/reviews",reviewRouter);

app.use("/users",userRouter);

app.use("/portfolio",portfolioRouter);

//------------------------------------routes end---------------------


app.all("*",(req,res,next)=>{
    next(new ExpressError (404,"page not found !"));
});

app.use((err, req, res, next) => {

    let {statusCode=500 ,message="something went wrong"}=err;

   
    res.status(statusCode).render("error.ejs",{message});
});

const PORT=process.env.PORT || 8081 ;

app.listen(PORT, () => {
    console.log("server is listening to : ",PORT);
});


