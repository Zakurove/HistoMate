var express = require("express");
var router = express.Router();
var CardioSet = require("../models/cardioSet");
var User      = require("../models/user");
var middleware = require("../middleware");
var multer = require('multer');
var test = require('../middleware/upload');
var { cloudinary, storage } = require('../cloudinary');
var upload = multer({ storage });
// const { asyncErrorHandler } = require('../middleware');
// var storage = multer.diskStorage({
//   filename: function(req, file, callback) {
//     callback(null, Date.now() + file.originalname);
//   }
// });
// var imageFilter = function (req, file, cb) {
//     // accept image files only
//     if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
//         return cb(new Error('Only image files are allowed!'), false);
//     }
//     cb(null, true);
// };
// var upload = multer({ storage: storage, fileFilter: imageFilter})

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


// router.get("/uploads", (req, res) => {
//  res.render("cardioSets/uploads")
// })

// router.post('/', upload.array('images', 4), asyncErrorHandler(cardioSetCreate));

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.cardioSet.images = [];
		for(const file of req.files) {
			req.body.cardioSet.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author to campground
		req.body.cardioSet.author = {
			id: req.user._id,
			username: req.user.username
		}
		const cardioSet = await CardioSet.create(req.body.cardioSet);
		console.log(cardioSet);
		res.redirect(`/cardioSets/${cardioSet.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

	  
	  
  // add cloudinary url for the image to the cardioSet object under image property
 
//   CardioSet.create(req.body.cardioSet, function(err, cardioSet) {
//     if (err) {
//       req.flash('error', err.message);
//       return res.redirect('back');
//     }
//     res.redirect('/cardioSets/' + cardioSet.id);
//   });
// });
// });
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
router.get("/:id/edit", checkCardioSetOwnership,  function(req,res){
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
router.delete("/:id", checkCardioSetOwnership, function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/cardioSets");
      } else {
          res.redirect("/cardioSets");
      }
   });
});


function checkCardioSetOwnership(req, res, next) {
	if(req.isAuthenticated()){
		CardioSet.findById(req.params.id, function(err, foundCardioSet){
			if(err){
				res.redirect("back");
			} else {
				if(foundCardioSet.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect("back");
				}
			}
		});
	} else {
		res.redirect("back");
	}
}

module.exports = router;
