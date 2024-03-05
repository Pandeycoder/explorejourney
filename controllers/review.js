const Listing=require("../models/listing");
const Review=require("../models/review");

//----------post review-----------------------

module.exports.createReview=async (req,res)=>{
   
    let listing=await Listing.findById(req.params.id);
 
    let newReview=new Review(req.body.review);

    newReview.author=req.user._id;  //check here author

    console.log(newReview);
 
    listing.review.push(newReview);
 
    await newReview.save();
 
    await listing.save();
    req.flash("success", "review created successfully !");
   // <!-- -------------------------update now------------------------------------------------>
    res.redirect(`/${listing._id}`);
 
 };

 //----------delete reveiw--------------

 module.exports.destroyReview=async(req,res)=>{
 
    let {id,reviewId}=req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {review:reviewId}});

    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "review deleted successfully !");
     // <!-- -------------------------update now------------------------------------------------>
    res.redirect(`/${id}`);
};