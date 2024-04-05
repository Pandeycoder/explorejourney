const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
let totalRequest = 0;

module.exports.index = async (req, res) => {
    /* ..................log request info..................................*/
    let requestCounter = 0;
    requestCounter++;
    totalRequest++;
    console.log(`Request ${requestCounter}: ${req.method} ${req.url}`);
    console.log(`total request right now : ${totalRequest}`);

    const userAgent = req.headers['user-agent'];
    let deviceType = 'Unknown';
    if (userAgent.includes('Mobile')) {
        deviceType = 'Mobile';
    } else if (userAgent.includes('Tablet')) {
        deviceType = 'Tablet';
    } else {
        deviceType = 'Desktop';
    }
    const ip = req.ip || req.connection.remoteAddress;
    console.log(`Request from IP ${ip} - Device Type: ${deviceType}`);
    console.log(`User-Agent: ${userAgent}`);
    console.log("\n");
     /* .................... end !..................................*/


    const allListings = await Listing.find({});


    res.render("listings/index.ejs", { allListings });
};


// ----------new route----------

module.exports.renderNewForm = (req, res) => {

    res.render("listings/new.ejs");
};


//--------------show route----------------------

module.exports.showListing = async (req, res) => {

    let { id } = req.params;

    const listing = await Listing.findById(id).populate({ path: "review", populate: { path: "author" }, }).populate("owner");

    if (!listing) {
        req.flash("error", " listing you requested for does not exist !");

        // <!-- -------------------------update now url------------------------------------------------>
        res.redirect("/");
    }
    res.render("listings/show.ejs", { listing });
};

//-----------create post route--------------------

module.exports.createListing = async (req, res, next) => {


    try {
        // Extracting multiple images from req.files
        const images = req.files.map(file => (
            {
             url: file.path,
             filename: file.filename

            }));
        
        // Sending geocoding request
        const response = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
        }).send();

        // Extracting coordinates from geocoding response
        const coordinates = response.body.features[0].geometry.coordinates;

        // Creating a new listing object with the provided data
        const newListing = new Listing({
            ...req.body.listing, // Copy other listing data
            image: images, // Assign images
            owner: req.user._id, // Assuming you have user authentication middleware
            geometry: {
                type: "Point",
                coordinates: coordinates
            }
        });

        // Saving the new listing to the database
        await newListing.save();
        
        req.flash('success', 'New listing created successfully!');
        res.redirect('/');
    } catch (err) {
        next(err);
    }
  
};

//-----------Edit listing----------------

module.exports.renderEditForm = async (req, res) => {

    let { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", " listing you requested for does not exist !");


        // <!-- -------------------------update now url------------------------------------------------>
        res.redirect("/");
    }

    //change image size and quality

    // let originalImage=listing.image.url;

    // originalImage=originalImage.replace("/upload","/upload/h_200,w_250");




    res.render("listings/edit.ejs", { listing });
};

//-----------Update route------------------

module.exports.renderUpdateForm = async (req, res) => {


    let { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
        .send();
    if (typeof req.file !== "undefined" || response.body.features) {

        let url = req.file.path;
        let filename = req.file.filename;



        listing.geometry = response.body.features[0].geometry;
        console.log(listing.geometry);

        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "listing updated successfully !");

    // <!-- -------------------------update now url------------------------------------------------>

    res.redirect(`/${id}`);

};




//-----------------delete listing--------

module.exports.renderDeleteForm = async (req, res) => {
    let { id } = req.params;

    const deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "listing deleted successfully !");
    console.log(deletedListing);


    // <!-- -------------------------update now url------------------------------------------------>
    res.redirect("/");

};