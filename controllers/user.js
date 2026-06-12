let User = require("../models/user.js");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.userSignup = async(req,res)=>{
    try{
    let {username,email,password}= req.body;
    const newUser = new User({email,username});
    const registerUser = await User.register(newUser,password);  
    console.log(registerUser);
    req.login(registerUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to the Wanderlust");
        res.redirect("/listings");
    });
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/login");
    }
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.userLogin = async(req,res)=>{
    req.flash("success","Welcome back!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.userLogout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "Logged you out!");
        res.redirect("/listings");
    });
};
