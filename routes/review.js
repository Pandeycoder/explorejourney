const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReivew, isLoggedIn, isReviewAuthor}=require("../middleware.js");

const reviewController=require("../controllers/review.js");



//----------------Reviews  create  route post---------

router.post("/" ,isLoggedIn,validateReivew, wrapAsync(reviewController.createReview));
 
 //------------------ Delete review route----------------------------------
 
 router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));
 

 module.exports=router;
 
 