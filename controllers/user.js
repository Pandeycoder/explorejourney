
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
            
              // <!-- -------------------------update now url------------------------------------------------>
            res.redirect("/");

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
    
   // <!-- -------------------------update now url------------------------------------------------>
    let redirectUrl= res.locals.redirectUrl || "/";
    res.redirect(redirectUrl);
};


//------------------------logout controller--------------------------------
module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{

        if(err){
           return next(err);
        }
        req.flash("success","you are logged out !");
        
              // <!-- -------------------------update now url------------------------------------------------>
        res.redirect("/");
    });

};