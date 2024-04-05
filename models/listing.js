const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review=require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  createdAt: { type: Date,
    default: Date.now 
   },
  
   image: [
    {
        url: String,
        filename: String
    }
  ],
  
  price: Number,
  discountPrice:Number,
  location: String,
  country: String,

  
  story_heading:String,
  story_title:String,
  story_content:String,

  story_heading1:String,
  story_title1:String,
  story_content1:String,

  story_heading2:String,
  story_title2:String,
  story_content2:String,

  story_heading3:String,
  story_title3:String,
  story_content3:String,

  story_heading4:String,
  story_title4:String,
  story_content4:String,

  story_heading5:String,
  story_content5:String,
  
  review:[{
    type:Schema.Types.ObjectId,
    ref:"Review",

  },],

  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",

  },
  geometry:
  {
    type:{
      type:String,
      enum: ['Point'],
      required :true,
    },
    coordinates:{
      type:[Number],
      required:true,
    }

  }
  
});

listingSchema.post("findOneAndDelete", async (listing)=>{
  
  if(listing)
  {
    await Review.deleteMany({_id:  {$in : listing.review}});
  
  }

});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;