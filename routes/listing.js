const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwnerUser } = require("../middleware.js");

const listingController=require("../controllers/listing.js");

const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});


router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,
upload.single('listing[image]'),
wrapAsync(listingController.createListing)
);


//--------------New route --------

router.get("/new",isLoggedIn,listingController.renderNewForm );



router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwnerUser,upload.single('listing[image]'), wrapAsync(listingController.renderUpdateForm))
.delete(isLoggedIn,isOwnerUser,wrapAsync(listingController.renderDeleteForm));



//-----------Edit route --------------------

router.get("/:id/edit",isLoggedIn,isOwnerUser, wrapAsync(listingController.renderEditForm));






// //-------------index route----------------

// router.get("/",wrapAsync(listingController.index)

// );



// //------------show route--------------
// router.get("/:id", wrapAsync(listingController.showListing));




// //-----------Create Route----------

// router.post("/",isLoggedIn,wrapAsync(listingController.createListing));


//-----------Update Route-------------

// router.put("/:id",isLoggedIn,isOwnerUser, wrapAsync(listingController.renderUpdateForm));

// ----------Delete route ------------------

// router.delete("/:id",isLoggedIn,isOwnerUser,wrapAsync(listingController.renderDeleteForm));

module.exports=router;