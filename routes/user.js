const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");
const userController=require("../controllers/user.js");


router.route("/signup")
.get( userController.renderSignupForm)
.post(wrapAsync(userController.userSignup));




router.route("/login")
.get( userController.renderLogin )
.post( savedRedirectUrl,
    passport.authenticate("local",
        {
            failureRedirect: '/users/login',
            failureFlash: true,
        }), userController.login

    )
.post(savedRedirectUrl,
    passport.authenticate("local",
        {
            failureRedirect: '/users/login',
            failureFlash: true,
        }), userController.login

    );


//---------------------logout user----------------------------

router.get("/logout",userController.logout);





// //---------------signup -------------------

// router.get("/signup", userController.renderSignupForm);


// //--------------login-----------------------

// router

// // -------------post method through signup user -----------------------
// router.post("/signup", wrapAsync(userController.userSignup));



// router.post("/login", savedRedirectUrl,
//     passport.authenticate("local",
//         {
//             failureRedirect: '/login',
//             failureFlash: true,
//         }), userController.login

//     );

    

module.exports = router;