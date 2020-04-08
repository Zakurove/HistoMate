var express = require("express");
var router = express.Router();
var GastroMicro = require("../models/Gastrointestinal/gastroMicro");
var GastroPatho = require("../models/Gastrointestinal/gastroPatho");
var GastroImaging = require("../models/Gastrointestinal/gastroImaging");
var GastroHisto = require("../models/Gastrointestinal/gastroHisto");
var GastroCyto = require("../models/Gastrointestinal/gastroCyto");
var GastroCt = require("../models/Gastrointestinal/gastroCt");
var User      = require("../models/user");
var middleware = require("../middleware");
var multer = require('multer');
var test = require('../middleware/upload');
var { cloudinary, storage } = require('../cloudinary');
var upload = multer({ storage });
router.get("/", middleware.isLoggedIn, (req, res) => {
 res.render("Gastrointestinal/subjects")
})
	

											//Patho ROUTES!!!
//INDEX route- show all sets
router.get("/patho", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	GastroPatho.find({}, function(err, allGastroPathos){
		if(err){
			console.log(err);
		} else {
			res.render("Gastrointestinal/patho/index", {gastroPathos:allGastroPathos, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/patho", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.gastroPatho.images = [];
		for(const file of req.files) {
			req.body.gastroPatho.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.gastroPatho.author = {
			id: req.user._id,
			username: req.user.username
		}
		const gastroPatho = await GastroPatho.create(req.body.gastroPatho);
		console.log(gastroPatho);
		res.redirect(`/Gastrointestinal/patho/${gastroPatho.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/patho/new", middleware.isLoggedIn, function(req, res){
	res.render("Gastrointestinal/patho/new");
});

//SHOW - revales more info about certain set
router.get("/patho/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	GastroPatho.findById(req.params.id, function(err, foundGastroPatho){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Gastrointestinal/patho/show", {gastroPatho: foundGastroPatho});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/patho/:id/edit",  function(req,res){
		  GastroPatho.findById(req.params.id, function(err, foundGastroPatho){
    if(err){
      res.redirect("/Gastrointestinal/patho");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Gastrointestinal/patho/edit.ejs", {gastroPatho: foundGastroPatho});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/patho/:id", function(req,res){
	
	GastroPatho.findByIdAndUpdate(req.params.id, req.body.gastroPatho, function(err, updatedGastroPatho){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Gastrointestinal/patho");
		} else {
			res.redirect("/Gastrointestinal/patho" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Gastrointestinal/patho");
      } else {
          res.redirect("/Gastrointestinal/patho");
      }
   });
});

											//Micro ROUTES!!!
//INDEX route- show all sets
router.get("/micro", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	GastroMicro.find({}, function(err, allGastroMicros){
		if(err){
			console.log(err);
		} else {
			res.render("Gastrointestinal/micro/index", {gastroMicros:allGastroMicros, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/micro", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.gastroMicro.images = [];
		for(const file of req.files) {
			req.body.gastroMicro.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.gastroMicro.author = {
			id: req.user._id,
			username: req.user.username
		}
		const gastroMicro = await GastroMicro.create(req.body.gastroMicro);
		console.log(gastroMicro);
		res.redirect(`/Gastrointestinal/micro/${gastroMicro.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/micro/new", middleware.isLoggedIn, function(req, res){
	res.render("Gastrointestinal/micro/new");
});

//SHOW - revales more info about certain set
router.get("/micro/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	GastroMicro.findById(req.params.id, function(err, foundGastroMicro){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Gastrointestinal/micro/show", {gastroMicro: foundGastroMicro});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/micro/:id/edit",  function(req,res){
		  GastroMicro.findById(req.params.id, function(err, foundGastroMicro){
    if(err){
      res.redirect("/Gastrointestinal/micro");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Gastrointestinal/micro/edit.ejs", {gastroMicro: foundGastroMicro});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/micro/:id", function(req,res){
	
	GastroMicro.findByIdAndUpdate(req.params.id, req.body.gastroMicro, function(err, updatedGastroMicro){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Gastrointestinal/micro");
		} else {
			res.redirect("/Gastrointestinal/micro" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Gastrointestinal/micro");
      } else {
          res.redirect("/Gastrointestinal/micro");
      }
   });
});



											//Imaging ROUTES!!!
//INDEX route- show all sets
router.get("/imaging", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	GastroImaging.find({}, function(err, allGastroImagings){
		if(err){
			console.log(err);
		} else {
			res.render("Gastrointestinal/imaging/index", {gastroImagings:allGastroImagings, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/imaging", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.gastroImaging.images = [];
		for(const file of req.files) {
			req.body.gastroImaging.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.gastroImaging.author = {
			id: req.user._id,
			username: req.user.username
		}
		const gastroImaging = await GastroImaging.create(req.body.gastroImaging);
		console.log(gastroImaging);
		res.redirect(`/Gastrointestinal/imaging/${gastroImaging.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/imaging/new", middleware.isLoggedIn, function(req, res){
	res.render("Gastrointestinal/imaging/new");
});

//SHOW - revales more info about certain set
router.get("/imaging/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	GastroImaging.findById(req.params.id, function(err, foundGastroImaging){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Gastrointestinal/imaging/show", {gastroImaging: foundGastroImaging});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/imaging/:id/edit",  function(req,res){
		  GastroImaging.findById(req.params.id, function(err, foundGastroImaging){
    if(err){
      res.redirect("/Gastrointestinal/Imaging");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Gastrointestinal/Imaging/edit.ejs", {gastroImaging: foundGastroImaging});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/Imaging/:id", function(req,res){
	
	GastroImaging.findByIdAndUpdate(req.params.id, req.body.gastroImaging, function(err, updatedGastroImaging){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Gastrointestinal/Imaging");
		} else {
			res.redirect("/Gastrointestinal/Imaing" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Gastrointestinal/Imaging");
      } else {
          res.redirect("/Gastrointestinal/Imaging");
      }
   });
});


											//Histo ROUTES!!!
//INDEX route- show all sets
router.get("/histo", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	GastroHisto.find({}, function(err, allGastroHistos){
		if(err){
			console.log(err);
		} else {
			res.render("Gastrointestinal/histo/index", {gastroHistos:allGastroHistos, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/histo", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.gastroHisto.images = [];
		for(const file of req.files) {
			req.body.gastroHisto.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.gastroHisto.author = {
			id: req.user._id,
			username: req.user.username
		}
		const gastroHisto = await GastroHisto.create(req.body.gastroHisto);
		console.log(gastroHisto);
		res.redirect(`/Gastrointestinal/histo/${gastroHisto.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/histo/new", middleware.isLoggedIn, function(req, res){
	res.render("Gastrointestinal/histo/new");
});

//SHOW - revales more info about certain set
router.get("/histo/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	GastroHisto.findById(req.params.id, function(err, foundGastroHisto){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Gastrointestinal/histo/show", {gastroHisto: foundGastroHisto});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/histo/:id/edit",  function(req,res){
		  GastroHisto.findById(req.params.id, function(err, foundGastroHisto){
    if(err){
      res.redirect("/Gastrointestinal/histo");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Gastrointestinal/histo/edit.ejs", {gastroHisto: foundGastroHisto});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/histo/:id", function(req,res){
	
	GastroHisto.findByIdAndUpdate(req.params.id, req.body.gastroHisto, function(err, updatedGastroHisto){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Gastrointestinal/histo");
		} else {
			res.redirect("/Gastrointestinal/histo" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Gastrointestinal/histo");
      } else {
          res.redirect("/Gastrointestinal/histo");
      }
   });
});

												//Cyto ROUTES!!!
//INDEX route- show all sets
router.get("/cyto", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	GastroCyto.find({}, function(err, allGastroCytos){
		if(err){
			console.log(err);
		} else {
			res.render("Gastrointestinal/cyto/index", {gastroCytos:allGastroCytos, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/cyto", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.gastroCyto.images = [];
		for(const file of req.files) {
			req.body.gastroCyto.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.gastroCyto.author = {
			id: req.user._id,
			username: req.user.username
		}
		const gastroCyto = await GastroCyto.create(req.body.gastroCyto);
		console.log(gastroCyto);
		res.redirect(`/Gastrointestinal/cyto/${gastroCyto.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/cyto/new", middleware.isLoggedIn, function(req, res){
	res.render("Gastrointestinal/cyto/new");
});

//SHOW - revales more info about certain set
router.get("/cyto/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	GastroCyto.findById(req.params.id, function(err, foundGastroCyto){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Gastrointestinal/cyto/show", {gastroCyto: foundGastroCyto});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/cyto/:id/edit",  function(req,res){
		  GastroCyto.findById(req.params.id, function(err, foundGastroCyto){
    if(err){
      res.redirect("/Gastrointestinal/cyto");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Gastrointestinal/cyto/edit.ejs", {gastroCyto: foundGastroCyto});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/cyto/:id", function(req,res){
	
	GastroCyto.findByIdAndUpdate(req.params.id, req.body.gastroCyto, function(err, updatedGastroCyto){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Gastrointestinal/cyto");
		} else {
			res.redirect("/Gastrointestinal/cyto" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Gastrointestinal/cyto");
      } else {
          res.redirect("/Gastrointestinal/cyto");
      }
   });
});


											//Ct ROUTES!!!
//INDEX route- show all sets
router.get("/ct", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	GastroCt.find({}, function(err, allGastroCts){
		if(err){
			console.log(err);
		} else {
			res.render("Gastrointestinal/ct/index", {gastroCts:allGastroCts, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/ct", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.gastroCt.images = [];
		for(const file of req.files) {
			req.body.gastroCt.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.gastroCt.author = {
			id: req.user._id,
			username: req.user.username
		}
		const gastroCt = await GastroCt.create(req.body.gastroCt);
		console.log(gastroCt);
		res.redirect(`/Gastrointestinal/ct/${gastroCt.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/ct/new", middleware.isLoggedIn, function(req, res){
	res.render("Gastrointestinal/ct/new");
});

//SHOW - revales more info about certain set
router.get("/ct/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	GastroCt.findById(req.params.id, function(err, foundGastroCt){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Gastrointestinal/ct/show", {gastroCt: foundGastroCt});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/ct/:id/edit",  function(req,res){
		  GastroCt.findById(req.params.id, function(err, foundGastroCt){
    if(err){
      res.redirect("/Gastrointestinal/ct");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Gastrointestinal/ct/edit.ejs", {gastroCt: foundGastroCt});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/ct/:id", function(req,res){
	
	GastroCt.findByIdAndUpdate(req.params.id, req.body.gastroCt, function(err, updatedGastroCt){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Gastrointestinal/ct");
		} else {
			res.redirect("/Gastrointestinal/ct" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Gastrointestinal/ct");
      } else {
          res.redirect("/Gastrointestinal/ct");
      }
   });
});





















module.exports = router;
