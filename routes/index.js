var express   = require("express");
var router    = express.Router();
var passport  = require("passport");
var User      = require("../models/user");
var flash     = require("connect-flash");

//                 ===============
//                      ROUTES
//                ================

//root route
router.get("/", function(req, res){
    res.render("mainPage");
});


//AUTHENTICAION ROUTES

//show sign up form
router.get("/register", function(req, res){
   res.render("register"); 
});
//handling user sign up
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
			console.log(err);
            req.flash("error", err.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to HisoMate, " + user.username + "!");
           res.redirect("/");
        });
    });
});

// LOGIN ROUTES
//render login form
router.get("/login", function(req, res){
	
   res.render("login"); 
});
//login logic
//middleware
router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
	failureFlash: true
}), function(req, res){
});
//Logout
router.get("/logout", function(req, res){
    req.logout();
	req.flash("success", "Logged you out!");
    res.redirect("/");
});





module.exports = router;


