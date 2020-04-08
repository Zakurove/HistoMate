var express = require("express");
var router = express.Router();
var HemaMicro = require("../models/Hematology/hemaMicro");
var HemaPatho = require("../models/Hematology/hemaPatho");
var HemaImaging = require("../models/Hematology/hemaImaging");
var HemaHisto = require("../models/Hematology/hemaHisto");
var HemaCyto = require("../models/Hematology/hemaCyto");
var HemaCt = require("../models/Hematology/hemaCt");
var User      = require("../models/user");
var middleware = require("../middleware");
var multer = require('multer');
var test = require('../middleware/upload');
var { cloudinary, storage } = require('../cloudinary');
var upload = multer({ storage });
router.get("/", middleware.isLoggedIn, (req, res) => {
 res.render("Hematology/subjects")
})
	

											//Patho ROUTES!!!
//INDEX route- show all sets
router.get("/patho", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	HemaPatho.find({}, function(err, allHemaPathos){
		if(err){
			console.log(err);
		} else {
			res.render("Hematology/patho/index", {hemaPathos:allHemaPathos, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/patho", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.hemaPatho.images = [];
		for(const file of req.files) {
			req.body.hemaPatho.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.hemaPatho.author = {
			id: req.user._id,
			username: req.user.username
		}
		const hemaPatho = await HemaPatho.create(req.body.hemaPatho);
		console.log(hemaPatho);
		res.redirect(`/Hematology/patho/${hemaPatho.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/patho/new", middleware.isLoggedIn, function(req, res){
	res.render("Hematology/patho/new");
});

//SHOW - revales more info about certain set
router.get("/patho/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	HemaPatho.findById(req.params.id, function(err, foundHemaPatho){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Hematology/patho/show", {hemaPatho: foundHemaPatho});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/patho/:id/edit",  function(req,res){
		  HemaPatho.findById(req.params.id, function(err, foundHemaPatho){
    if(err){
      res.redirect("/Hematology/patho");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Hematology/patho/edit.ejs", {hemaPatho: foundHemaPatho});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/patho/:id", function(req,res){
	
	HemaPatho.findByIdAndUpdate(req.params.id, req.body.hemaPatho, function(err, updatedHemaPatho){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Hematology/patho");
		} else {
			res.redirect("/Hematology/patho" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Hematology/patho");
      } else {
          res.redirect("/Hematology/patho");
      }
   });
});

											//Micro ROUTES!!!
//INDEX route- show all sets
router.get("/micro", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	HemaMicro.find({}, function(err, allHemaMicros){
		if(err){
			console.log(err);
		} else {
			res.render("Hematology/micro/index", {hemaMicros:allHemaMicros, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/micro", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.hemaMicro.images = [];
		for(const file of req.files) {
			req.body.hemaMicro.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.hemaMicro.author = {
			id: req.user._id,
			username: req.user.username
		}
		const hemaMicro = await HemaMicro.create(req.body.hemaMicro);
		console.log(hemaMicro);
		res.redirect(`/Hematology/micro/${hemaMicro.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/micro/new", middleware.isLoggedIn, function(req, res){
	res.render("Hematology/micro/new");
});

//SHOW - revales more info about certain set
router.get("/micro/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	HemaMicro.findById(req.params.id, function(err, foundHemaMicro){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Hematology/micro/show", {hemaMicro: foundHemaMicro});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/micro/:id/edit",  function(req,res){
		  HemaMicro.findById(req.params.id, function(err, foundHemaMicro){
    if(err){
      res.redirect("/Hematology/micro");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Hematology/micro/edit.ejs", {hemaMicro: foundHemaMicro});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/micro/:id", function(req,res){
	
	HemaMicro.findByIdAndUpdate(req.params.id, req.body.hemaMicro, function(err, updatedHemaMicro){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Hematology/micro");
		} else {
			res.redirect("/Hematology/micro" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Hematology/micro");
      } else {
          res.redirect("/Hematology/micro");
      }
   });
});



											//Imaging ROUTES!!!
//INDEX route- show all sets
router.get("/imaging", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	HemaImaging.find({}, function(err, allHemaImagings){
		if(err){
			console.log(err);
		} else {
			res.render("Hematology/imaging/index", {hemaImagings:allHemaImagings, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/imaging", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.hemaImaging.images = [];
		for(const file of req.files) {
			req.body.hemaImaging.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.hemaImaging.author = {
			id: req.user._id,
			username: req.user.username
		}
		const hemaImaging = await HemaImaging.create(req.body.hemaImaging);
		console.log(hemaImaging);
		res.redirect(`/Hematology/imaging/${hemaImaging.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/imaging/new", middleware.isLoggedIn, function(req, res){
	res.render("Hematology/imaging/new");
});

//SHOW - revales more info about certain set
router.get("/imaging/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	HemaImaging.findById(req.params.id, function(err, foundHemaImaging){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Hematology/imaging/show", {hemaImaging: foundHemaImaging});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/imaging/:id/edit",  function(req,res){
		  HemaImaging.findById(req.params.id, function(err, foundHemaImaging){
    if(err){
      res.redirect("/Hematology/Imaging");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Hematology/Imaging/edit.ejs", {hemaImaging: foundHemaImaging});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/Imaging/:id", function(req,res){
	
	HemaImaging.findByIdAndUpdate(req.params.id, req.body.hemaImaging, function(err, updatedHemaImaging){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Hematology/Imaging");
		} else {
			res.redirect("/Hematology/Imaing" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Hematology/Imaging");
      } else {
          res.redirect("/Hematology/Imaging");
      }
   });
});


											//Histo ROUTES!!!
//INDEX route- show all sets
router.get("/histo", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	HemaHisto.find({}, function(err, allHemaHistos){
		if(err){
			console.log(err);
		} else {
			res.render("Hematology/histo/index", {hemaHistos:allHemaHistos, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/histo", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.hemaHisto.images = [];
		for(const file of req.files) {
			req.body.hemaHisto.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.hemaHisto.author = {
			id: req.user._id,
			username: req.user.username
		}
		const hemaHisto = await HemaHisto.create(req.body.hemaHisto);
		console.log(hemaHisto);
		res.redirect(`/Hematology/histo/${hemaHisto.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/histo/new", middleware.isLoggedIn, function(req, res){
	res.render("Hematology/histo/new");
});

//SHOW - revales more info about certain set
router.get("/histo/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	HemaHisto.findById(req.params.id, function(err, foundHemaHisto){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Hematology/histo/show", {hemaHisto: foundHemaHisto});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/histo/:id/edit",  function(req,res){
		  HemaHisto.findById(req.params.id, function(err, foundHemaHisto){
    if(err){
      res.redirect("/Hematology/histo");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Hematology/histo/edit.ejs", {hemaHisto: foundHemaHisto});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/histo/:id", function(req,res){
	
	HemaHisto.findByIdAndUpdate(req.params.id, req.body.hemaHisto, function(err, updatedHemaHisto){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Hematology/histo");
		} else {
			res.redirect("/Hematology/histo" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Hematology/histo");
      } else {
          res.redirect("/Hematology/histo");
      }
   });
});

												//Cyto ROUTES!!!
//INDEX route- show all sets
router.get("/cyto", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	HemaCyto.find({}, function(err, allHemaCytos){
		if(err){
			console.log(err);
		} else {
			res.render("Hematology/cyto/index", {hemaCytos:allHemaCytos, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/cyto", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.hemaCyto.images = [];
		for(const file of req.files) {
			req.body.hemaCyto.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.hemaCyto.author = {
			id: req.user._id,
			username: req.user.username
		}
		const hemaCyto = await HemaCyto.create(req.body.hemaCyto);
		console.log(hemaCyto);
		res.redirect(`/Hematology/cyto/${hemaCyto.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/cyto/new", middleware.isLoggedIn, function(req, res){
	res.render("Hematology/cyto/new");
});

//SHOW - revales more info about certain set
router.get("/cyto/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	HemaCyto.findById(req.params.id, function(err, foundHemaCyto){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Hematology/cyto/show", {hemaCyto: foundHemaCyto});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/cyto/:id/edit",  function(req,res){
		  HemaCyto.findById(req.params.id, function(err, foundHemaCyto){
    if(err){
      res.redirect("/Hematology/cyto");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Hematology/cyto/edit.ejs", {hemaCyto: foundHemaCyto});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/cyto/:id", function(req,res){
	
	HemaCyto.findByIdAndUpdate(req.params.id, req.body.hemaCyto, function(err, updatedHemaCyto){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Hematology/cyto");
		} else {
			res.redirect("/Hematology/cyto" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Hematology/cyto");
      } else {
          res.redirect("/Hematology/cyto");
      }
   });
});


											//Ct ROUTES!!!
//INDEX route- show all sets
router.get("/ct", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	HemaCt.find({}, function(err, allHemaCts){
		if(err){
			console.log(err);
		} else {
			res.render("Hematology/ct/index", {hemaCts:allHemaCts, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/ct", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.hemaCt.images = [];
		for(const file of req.files) {
			req.body.hemaCt.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.hemaCt.author = {
			id: req.user._id,
			username: req.user.username
		}
		const hemaCt = await HemaCt.create(req.body.hemaCt);
		console.log(hemaCt);
		res.redirect(`/Hematology/ct/${hemaCt.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/ct/new", middleware.isLoggedIn, function(req, res){
	res.render("Hematology/ct/new");
});

//SHOW - revales more info about certain set
router.get("/ct/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	HemaCt.findById(req.params.id, function(err, foundHemaCt){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Hematology/ct/show", {hemaCt: foundHemaCt});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/ct/:id/edit",  function(req,res){
		  HemaCt.findById(req.params.id, function(err, foundHemaCt){
    if(err){
      res.redirect("/Hematology/ct");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Hematology/ct/edit.ejs", {hemaCt: foundHemaCt});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/ct/:id", function(req,res){
	
	HemaCt.findByIdAndUpdate(req.params.id, req.body.hemaCt, function(err, updatedHemaCt){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Hematology/ct");
		} else {
			res.redirect("/Hematology/ct" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Hematology/ct");
      } else {
          res.redirect("/Hematology/ct");
      }
   });
});





















module.exports = router;
