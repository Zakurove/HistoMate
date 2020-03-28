
var express = require("express");
var router = express.Router({mergeParams: true});
var Slides = require("../models/slides");
//                             SLIDES ROUTES!!!
//INDEX route- show all slides
router.get("/slides", function(req, res){
	app.set('view engine', 'ejs');
	//Get slides from DB
	Slide.find({}, function(err, allSlides){
		if(err){
			console.log(err);
		} else {
			res.render("slides/index", {slides:allSlides});
		}
	});
});

// CREATE route - add a new slide
router.post("/slides", function(req, res){
	var title= req.body.title
	var image= req.body.image
	var description= req.body.description
	var newSlide = {title: title, image: image, description: description}
	//Create a new slide and save it to DB
	Slide.create(newSlide, function(err, freshSlide){
		if(err){
			console.log(err);
		} else {
				//Redirect back to slides page
				res.redirect("/slides");
		}
	});

});

//NEW - show form to create a new slide
router.get("/slides/new", function(req, res){
	app.set('view engine', 'ejs');
	res.render("slides/new");
});



//SHOW - revales more info about certain slide
router.get("/slides/:id", function(req, res){
	app.set('view engine', 'ejs');
	//find slide with provided id
	Slide.findById(req.params.id, function(err, foundSlide){
		if(err){
			console.log(err);
		} else { 
			//render page of the slide
			res.render("slides/show", {slide: foundSlide});
		}	
	});
	
})
//EDIT - transfers to the editing page of the slide
router.get("/slides/:id/editSlide", function(req,res){
	app.set('view engine', 'ejs');
	//Fetch the right ID 
	Slide.findById(req.params.id, function(err, foundSlide){
		if(err){
			res.redirect("/slides");	
		} else {
			res.render("slides/edit", {slide: foundSlide});
		}
	});
	
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/slides/:id", function(req,res){
	Slide.findByIdAndUpdate(req.params.id, req.body.slide, function(err, updatedSlide){
		if(err){
			res.redirect("/slides");
		} else {
			res.redirect("/slides/" + req.params.id);
		}
	});
});

//DELETE - delete the chosen slide then redirect somewhre
router.delete("/slides/:id", function(req,res){
		Slide.findByIdAndRemove(req.params.id, function(err){
			if(err){
				res.redirect("/slides");
			} else {
				res.redirect("/slides");
			}
		})
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;