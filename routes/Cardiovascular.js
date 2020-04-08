var express = require("express");
var router = express.Router();
var CardioMicro = require("../models/Cardiovascular/cardioMicro");
var CardioPatho = require("../models/Cardiovascular/cardioPatho");
var CardioImaging = require("../models/Cardiovascular/cardioImaging");
var CardioHisto = require("../models/Cardiovascular/cardioHisto");
var CardioCyto = require("../models/Cardiovascular/cardioCyto");
var CardioCt = require("../models/Cardiovascular/cardioCt");
var User      = require("../models/user");
var middleware = require("../middleware");
var multer = require('multer');
var test = require('../middleware/upload');
var { cloudinary, storage } = require('../cloudinary');
var upload = multer({ storage });
router.get("/", middleware.isLoggedIn, (req, res) => {
 res.render("Cardiovascular/subjects")
})
	

											//Patho ROUTES!!!
//INDEX route- show all sets
router.get("/patho", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	CardioPatho.find({}, function(err, allCardioPathos){
		if(err){
			console.log(err);
		} else {
			res.render("Cardiovascular/patho/index", {cardioPathos:allCardioPathos, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/patho", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.cardioPatho.images = [];
		for(const file of req.files) {
			req.body.cardioPatho.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.cardioPatho.author = {
			id: req.user._id,
			username: req.user.username
		}
		const cardioPatho = await CardioPatho.create(req.body.cardioPatho);
		console.log(cardioPatho);
		res.redirect(`/Cardiovascular/patho/${cardioPatho.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/patho/new", middleware.isLoggedIn, function(req, res){
	res.render("Cardiovascular/patho/new");
});

//SHOW - revales more info about certain set
router.get("/patho/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	CardioPatho.findById(req.params.id, function(err, foundCardioPatho){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Cardiovascular/patho/show", {cardioPatho: foundCardioPatho});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/patho/:id/edit",  function(req,res){
		  CardioPatho.findById(req.params.id, function(err, foundCardioPatho){
    if(err){
      res.redirect("/Cardiovascular/patho");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Cardiovascular/patho/edit.ejs", {cardioPatho: foundCardioPatho});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/patho/:id", function(req,res){
	
	CardioPatho.findByIdAndUpdate(req.params.id, req.body.cardioPatho, function(err, updatedCardioPatho){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Cardiovascular/patho");
		} else {
			res.redirect("/Cardiovascular/patho" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Cardiovascular/patho");
      } else {
          res.redirect("/Cardiovascular/patho");
      }
   });
});

											//Micro ROUTES!!!
//INDEX route- show all sets
router.get("/micro", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	CardioMicro.find({}, function(err, allCardioMicros){
		if(err){
			console.log(err);
		} else {
			res.render("Cardiovascular/micro/index", {cardioMicros:allCardioMicros, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/micro", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.cardioMicro.images = [];
		for(const file of req.files) {
			req.body.cardioMicro.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.cardioMicro.author = {
			id: req.user._id,
			username: req.user.username
		}
		const cardioMicro = await CardioMicro.create(req.body.cardioMicro);
		console.log(cardioMicro);
		res.redirect(`/Cardiovascular/micro/${cardioMicro.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/micro/new", middleware.isLoggedIn, function(req, res){
	res.render("Cardiovascular/micro/new");
});

//SHOW - revales more info about certain set
router.get("/micro/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	CardioMicro.findById(req.params.id, function(err, foundCardioMicro){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Cardiovascular/micro/show", {cardioMicro: foundCardioMicro});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/micro/:id/edit",  function(req,res){
		  CardioMicro.findById(req.params.id, function(err, foundCardioMicro){
    if(err){
      res.redirect("/Cardiovascular/micro");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Cardiovascular/micro/edit.ejs", {cardioMicro: foundCardioMicro});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/micro/:id", function(req,res){
	
	CardioMicro.findByIdAndUpdate(req.params.id, req.body.cardioMicro, function(err, updatedCardioMicro){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Cardiovascular/micro");
		} else {
			res.redirect("/Cardiovascular/micro" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Cardiovascular/micro");
      } else {
          res.redirect("/Cardiovascular/micro");
      }
   });
});



											//Imaging ROUTES!!!
//INDEX route- show all sets
router.get("/imaging", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	CardioImaging.find({}, function(err, allCardioImagings){
		if(err){
			console.log(err);
		} else {
			res.render("Cardiovascular/imaging/index", {cardioImagings:allCardioImagings, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/imaging", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.cardioImaging.images = [];
		for(const file of req.files) {
			req.body.cardioImaging.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.cardioImaging.author = {
			id: req.user._id,
			username: req.user.username
		}
		const cardioImaging = await CardioImaging.create(req.body.cardioImaging);
		console.log(cardioImaging);
		res.redirect(`/Cardiovascular/imaging/${cardioImaging.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/imaging/new", middleware.isLoggedIn, function(req, res){
	res.render("Cardiovascular/imaging/new");
});

//SHOW - revales more info about certain set
router.get("/imaging/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	CardioImaging.findById(req.params.id, function(err, foundCardioImaging){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Cardiovascular/imaging/show", {cardioImaging: foundCardioImaging});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/imaging/:id/edit",  function(req,res){
		  CardioImaging.findById(req.params.id, function(err, foundCardioImaging){
    if(err){
      res.redirect("/Cardiovascular/Imaging");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Cardiovascular/Imaging/edit.ejs", {cardioImaging: foundCardioImaging});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/Imaging/:id", function(req,res){
	
	CardioImaging.findByIdAndUpdate(req.params.id, req.body.cardioImaging, function(err, updatedCardioImaging){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Cardiovascular/Imaging");
		} else {
			res.redirect("/Cardiovascular/Imaing" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Cardiovascular/Imaging");
      } else {
          res.redirect("/Cardiovascular/Imaging");
      }
   });
});


											//Histo ROUTES!!!
//INDEX route- show all sets
router.get("/histo", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	CardioHisto.find({}, function(err, allCardioHistos){
		if(err){
			console.log(err);
		} else {
			res.render("Cardiovascular/histo/index", {cardioHistos:allCardioHistos, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/histo", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.cardioHisto.images = [];
		for(const file of req.files) {
			req.body.cardioHisto.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.cardioHisto.author = {
			id: req.user._id,
			username: req.user.username
		}
		const cardioHisto = await CardioHisto.create(req.body.cardioHisto);
		console.log(cardioHisto);
		res.redirect(`/Cardiovascular/histo/${cardioHisto.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/histo/new", middleware.isLoggedIn, function(req, res){
	res.render("Cardiovascular/histo/new");
});

//SHOW - revales more info about certain set
router.get("/histo/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	CardioHisto.findById(req.params.id, function(err, foundCardioHisto){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Cardiovascular/histo/show", {cardioHisto: foundCardioHisto});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/histo/:id/edit",  function(req,res){
		  CardioHisto.findById(req.params.id, function(err, foundCardioHisto){
    if(err){
      res.redirect("/Cardiovascular/histo");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Cardiovascular/histo/edit.ejs", {cardioHisto: foundCardioHisto});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/histo/:id", function(req,res){
	
	CardioHisto.findByIdAndUpdate(req.params.id, req.body.cardioHisto, function(err, updatedCardioHisto){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Cardiovascular/histo");
		} else {
			res.redirect("/Cardiovascular/histo" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Cardiovascular/histo");
      } else {
          res.redirect("/Cardiovascular/histo");
      }
   });
});

												//Cyto ROUTES!!!
//INDEX route- show all sets
router.get("/cyto", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	CardioCyto.find({}, function(err, allCardioCytos){
		if(err){
			console.log(err);
		} else {
			res.render("Cardiovascular/cyto/index", {cardioCytos:allCardioCytos, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/cyto", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.cardioCyto.images = [];
		for(const file of req.files) {
			req.body.cardioCyto.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.cardioCyto.author = {
			id: req.user._id,
			username: req.user.username
		}
		const cardioCyto = await CardioCyto.create(req.body.cardioCyto);
		console.log(cardioCyto);
		res.redirect(`/Cardiovascular/cyto/${cardioCyto.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/cyto/new", middleware.isLoggedIn, function(req, res){
	res.render("Cardiovascular/cyto/new");
});

//SHOW - revales more info about certain set
router.get("/cyto/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	CardioCyto.findById(req.params.id, function(err, foundCardioCyto){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Cardiovascular/cyto/show", {cardioCyto: foundCardioCyto});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/cyto/:id/edit",  function(req,res){
		  CardioCyto.findById(req.params.id, function(err, foundCardioCyto){
    if(err){
      res.redirect("/Cardiovascular/cyto");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Cardiovascular/cyto/edit.ejs", {cardioCyto: foundCardioCyto});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/cyto/:id", function(req,res){
	
	CardioCyto.findByIdAndUpdate(req.params.id, req.body.cardioCyto, function(err, updatedCardioCyto){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Cardiovascular/cyto");
		} else {
			res.redirect("/Cardiovascular/cyto" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Cardiovascular/cyto");
      } else {
          res.redirect("/Cardiovascular/cyto");
      }
   });
});


											//Ct ROUTES!!!
//INDEX route- show all sets
router.get("/ct", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	CardioCt.find({}, function(err, allCardioCts){
		if(err){
			console.log(err);
		} else {
			res.render("Cardiovascular/ct/index", {cardioCts:allCardioCts, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/ct", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.cardioCt.images = [];
		for(const file of req.files) {
			req.body.cardioCt.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.cardioCt.author = {
			id: req.user._id,
			username: req.user.username
		}
		const cardioCt = await CardioCt.create(req.body.cardioCt);
		console.log(cardioCt);
		res.redirect(`/Cardiovascular/ct/${cardioCt.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/ct/new", middleware.isLoggedIn, function(req, res){
	res.render("Cardiovascular/ct/new");
});

//SHOW - revales more info about certain set
router.get("/ct/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	CardioCt.findById(req.params.id, function(err, foundCardioCt){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Cardiovascular/ct/show", {cardioCt: foundCardioCt});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/ct/:id/edit",  function(req,res){
		  CardioCt.findById(req.params.id, function(err, foundCardioCt){
    if(err){
      res.redirect("/Cardiovascular/ct");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Cardiovascular/ct/edit.ejs", {cardioCt: foundCardioCt});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/ct/:id", function(req,res){
	
	CardioCt.findByIdAndUpdate(req.params.id, req.body.cardioCt, function(err, updatedCardioCt){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Cardiovascular/ct");
		} else {
			res.redirect("/Cardiovascular/ct" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Cardiovascular/ct");
      } else {
          res.redirect("/Cardiovascular/ct");
      }
   });
});





















module.exports = router;
