
const User=require("../models/user");
//-------------signUp page----------------

const { model } = require("mongoose");

module.exports.renderSignupForm= (req, res) => {

    res.render("users/signup.ejs");
} ;


//----------singup controller----------
module.exports.userSignup=async (req, res) => {

    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        

        req.login(registeredUser,(err)=>{

            if(err)
            {
                return next(err);
            }
            req.flash("success", "user was register successfully");
            res.redirect("/listing");

        })


        
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/users/signup");

    }

};


//-------------login show controller-----------------

module.exports.renderLogin=(req, res) => {
    res.render("users/login.ejs");
};


 //-----------------------login controller--------

 module.exports.login=async (req, res) => {

    req.flash("success","Welcome back to explorejurney !")

    let redirectUrl= res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
};


//------------------------logout controller--------------------------------
module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{

        if(err){
           return next(err);
        }
        req.flash("success","you are logged out !");
        res.redirect("/listing");
    });

};