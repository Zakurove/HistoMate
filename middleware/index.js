var CardioSet = require("../models/cardioSet");


// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkCardioSetOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        CardioSet.findById(req.params.id, function(err, foundCardioSet){
           if(err){
			   req.flash("error", "This set can't be found");
               res.redirect("back");
           }  else {
               // does user own the cardioSet?
            if(foundCardioSet.author.id.equals(req.user._id)) {
                next();
            } else {
				req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
		req.flash("error", "Please Login First!")
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
	req.flash("error", "Please Login First!");
    res.redirect("/login");
}

module.exports = middlewareObj;