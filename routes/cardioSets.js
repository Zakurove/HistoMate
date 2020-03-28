var express = require("express");
var router = express.Router();
var CardioSet = require("../models/cardioSet");
var User      = require("../models/user");
var middleware = require("../middleware");
// var methodOverride = require("method-override");

//CARDIO ROUTES!!!
//INDEX route- show all sets
router.get("/", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	CardioSet.find({}, function(err, allCardioSets){
		if(err){
			console.log(err);
		} else {
			res.render("cardioSets/index", {cardioSets:allCardioSets, currentUser: req.user});
		}
	});
});



//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var title = req.body.title;
    var image = req.body.image;
    var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	console.log(req.user.username)
    var newCardioSet = {title: title, image: image, description: description, author: author}
    // Create a new campground and save to DB
    CardioSet.create(newCardioSet, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
			req.flash("success", "Successfully added set!")
            //redirect back to campgrounds page
            res.redirect("/cardioSets");
        }
    });
});
// //UPLOAD STUFF
// app.post('/uploadDB', upload.single('file'), (req, res) => {
//   var filePath = './uploads/' + req.file.originalname;
//   client.connect(err => {
//     const collection = client.db("test").collection("cardioSets");
//     const db = client.db("test");
//     var bucket = new mongodb.GridFSBucket(db);
//     fs.createReadStream(filePath).pipe(bucket.openUploadStream(req.file.originalname)).on('error', function(error) {
//       console.log(error);
//     }).on('finish', function() {
//       console.log('done saving the file!');
//     });
//   });
//   return res.status(200).send(req.file)
// });
// app.post('/upload', function(req, res) {
//   console.log("server accc");
//   return res.status(200)
// });


//NEW - show form to create a new set
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("cardioSets/new");
});



//SHOW - revales more info about certain set
router.get("/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	CardioSet.findById(req.params.id, function(err, foundCardioSet){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("cardioSets/show", {cardioSet: foundCardioSet});
		}	
	});
	
})
//EDIT - transfers to the editing page of the set
router.get("/:id/edit", middleware.checkCardioSetOwnership,  function(req,res){
		  CardioSet.findById(req.params.id, function(err, foundCardioSet){
    if(err){
      res.redirect("/cardioSets");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("cardioSets/edit.ejs", {cardioSet: foundCardioSet});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/:id", function(req,res){
	
	CardioSet.findByIdAndUpdate(req.params.id, req.body.cardioSet, function(err, updatedCardioSet){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/cardioSets");
		} else {
			res.redirect("/cardioSets/" + req.params.id);
		}
	});
});

// DESTROY CARDIOSET ROUTE
router.delete("/:id", middleware.checkCardioSetOwnership, function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/cardioSets");
      } else {
          res.redirect("/cardioSets");
      }
   });
});


// function checkCardioSetOwnership(req, res, next) {
// 	if(req.isAuthenticated()){
// 		CardioSet.findById(req.params.id, function(err, foundCardioSet){
// 			if(err){
// 				res.redirect("back");
// 			} else {
// 				if(foundCardioSet.author.id.equals(req.user._id)) {
// 					next();
// 				} else {
// 					res.redirect("back");
// 				}
// 			}
// 		});
// 	} else {
// 		res.redirect("back");
// 	}
// }

module.exports = router;
