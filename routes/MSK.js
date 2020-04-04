var express = require("express");
var router = express.Router();
var MskMicro = require("../models/MSK/mskMicro");
var MskPatho = require("../models/MSK/mskPatho");
var User      = require("../models/user");
var middleware = require("../middleware");
var multer = require('multer');
var test = require('../middleware/upload');
// const { asyncErrorHandler } = require('../middleware');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})


// var methodOverride = require("method-override");
router.get("/", (req, res) => {
 res.render("MSK/subjects")
})
//Micro ROUTES!!!
//INDEX route- show all sets
router.get("/micro", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	MskMicro.find({}, function(err, allMskMicros){
		if(err){
			console.log(err);
		} else {
			res.render("MSK/micro/index", {mskMicros:allMskMicros, currentUser: req.user});
		}
	});
});


// router.get("/uploads", (req, res) => {
//  res.render("cardioSets/uploads")
// })

// router.post('/', upload.array('images', 4), asyncErrorHandler(cardioSetCreate));

//CREATE - add new campground to DB
router.post("/", upload.array('image', 4), middleware.isLoggedIn, upload.single('image'), function(req, res) {
    cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
		  if(err) {
			req.flash('error', err.message);
			return res.redirect('back');
		 	 }
      // add cloudinary url for the image to the cardioSet object under image property
      req.body.cardioSet.image = result.secure_url;
      // add image's public_id to campground object
      req.body.cardioSet.imageId = result.public_id;
      // add author to campground
      req.body.cardioSet.author = {
        id: req.user._id,
        username: req.user.username
    	 }
      CardioSet.create(req.body.cardioSet, function(err, cardioSet) {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('back');
      		  }
        res.redirect('/cardioSets/' + cardioSet.id);
      	});
    });
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
router.get("/micro/new", middleware.isLoggedIn, function(req, res){
	res.render("MSK/micro/new");
});



//SHOW - revales more info about certain set
router.get("/micro/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	MskMicro.findById(req.params.id, function(err, foundMskMicro){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("MSK/micro/show", {mskMicro: foundCardioSet});
		}	
	});
	
})
//EDIT - transfers to the editing page of the set
router.get("/micro/:id/edit",  function(req,res){
		  MskMicro.findById(req.params.id, function(err, foundMskMicro){
    if(err){
      res.redirect("/MSK/micro");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("MSK/micro/edit.ejs", {mskMicro: foundMskMicro});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/micro/:id", function(req,res){
	
	MskMicro.findByIdAndUpdate(req.params.id, req.body.mskMicro, function(err, updatedMskMicro){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/MSK/micro");
		} else {
			res.redirect("/MSK/micro" + req.params.id);
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
