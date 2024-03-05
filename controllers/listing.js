const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({accessToken:mapToken});


module.exports.index=async (req, res) => {

        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    };


    // ----------new route----------

    module.exports.renderNewForm= (req, res) => {

        res.render("listings/new.ejs");
    };


    //--------------show route----------------------

    module.exports.showListing=async (req, res) => {

        let { id } = req.params;
    
        const listing = await Listing.findById(id).populate({path:"review",populate:{path:"author"},}).populate("owner");
    
        if(!listing)
        {
            req.flash("error"," listing you requested for does not exist !");
    
            res.redirect("/listing");
        }
        res.render("listings/show.ejs", { listing });
    };

    //-----------create post route--------------------

    module.exports.createListing=async (req, res,next) => {
        // let {title,description ,image ,price,country,location}=req.body;
        // if(!req.body.listing){
        //     throw new ExpressError(400,"please send valid data !");
        // }
        let response= await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
          })
            .send();

         
        let url=req.file.path;
        let filename=req.file.filename;
       

            let listing = req.body.listing;
            const newListing = new Listing(listing);
    
            newListing.owner=req.user._id;
    
            newListing.image={url,filename};

            newListing.geometry=   response.body.features[0].geometry;

    
            await newListing.save();
    
            req.flash("success", "New listing created successfully !");
    
            res.redirect("/listing");
      
    };

//-----------Edit listing----------------

    module.exports.renderEditForm=async (req, res) => {

        let { id } = req.params;
    
        const listing = await Listing.findById(id);
        
        if(!listing)
        {
            req.flash("error", " listing you requested for does not exist !");
    
            res.redirect("/listing");
        }

        //change image size and quality

        // let originalImage=listing.image.url;

        // originalImage=originalImage.replace("/upload","/upload/h_200,w_250");




        res.render("listings/edit.ejs", { listing});
    };

    //-----------Update route------------------

    module.exports.renderUpdateForm=async (req, res) => {

   
        let { id } = req.params;
    
       let listing= await Listing.findByIdAndUpdate(id, { ...req.body.listing });

       let response= await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send();
       if(typeof req.file !=="undefined" ||   response.body.features)
       {

        let url=req.file.path;
        let filename=req.file.filename;

      

        listing.geometry=   response.body.features[0].geometry;
        console.log(listing.geometry);

        listing.image={url , filename};
        await listing.save();
       }
        req.flash("success", "listing updated successfully !");
        
        res.redirect(`/listing/${id}`);
    
    };

    


    //-----------------delete listing--------

    module.exports.renderDeleteForm=async (req, res) => {
        let { id } = req.params;
    
        const deletedListing = await Listing.findByIdAndDelete(id);
        req.flash("success", "listing deleted successfully !");
        console.log(deletedListing);
    
        res.redirect("/listing");
    
    };