var express = require("express");
var router = express.Router();
var NeuroMicro = require("../models/Neurology/neuroMicro");
var NeuroPatho = require("../models/Neurology/neuroPatho");
var NeuroImaging = require("../models/Neurology/neuroImaging");
var NeuroHisto = require("../models/Neurology/neuroHisto");
var NeuroCyto = require("../models/Neurology/neuroCyto");
var NeuroCt = require("../models/Neurology/neuroCt");
var User      = require("../models/user");
var middleware = require("../middleware");
var multer = require('multer');
var test = require('../middleware/upload');
var { cloudinary, storage } = require('../cloudinary');
var upload = multer({ storage });
router.get("/", middleware.isLoggedIn, (req, res) => {
 res.render("Neurology/subjects")
})
	

											//Patho ROUTES!!!
//INDEX route- show all sets
router.get("/patho", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	NeuroPatho.find({}, function(err, allNeuroPathos){
		if(err){
			console.log(err);
		} else {
			res.render("Neurology/patho/index", {neuroPathos:allNeuroPathos, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/patho", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.neuroPatho.images = [];
		for(const file of req.files) {
			req.body.neuroPatho.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.neuroPatho.author = {
			id: req.user._id,
			username: req.user.username
		}
		const neuroPatho = await NeuroPatho.create(req.body.neuroPatho);
		console.log(neuroPatho);
		res.redirect(`/Neurology/patho/${neuroPatho.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/patho/new", middleware.isLoggedIn, function(req, res){
	res.render("Neurology/patho/new");
});

//SHOW - revales more info about certain set
router.get("/patho/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	NeuroPatho.findById(req.params.id, function(err, foundNeuroPatho){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Neurology/patho/show", {neuroPatho: foundNeuroPatho});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/patho/:id/edit",  function(req,res){
		  NeuroPatho.findById(req.params.id, function(err, foundNeuroPatho){
    if(err){
      res.redirect("/Neurology/patho");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Neurology/patho/edit.ejs", {neuroPatho: foundNeuroPatho});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/patho/:id", function(req,res){
	
	NeuroPatho.findByIdAndUpdate(req.params.id, req.body.neuroPatho, function(err, updatedNeuroPatho){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Neurology/patho");
		} else {
			res.redirect("/Neurology/patho" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Neurology/patho");
      } else {
          res.redirect("/Neurology/patho");
      }
   });
});

											//Micro ROUTES!!!
//INDEX route- show all sets
router.get("/micro", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	NeuroMicro.find({}, function(err, allNeuroMicros){
		if(err){
			console.log(err);
		} else {
			res.render("Neurology/micro/index", {neuroMicros:allNeuroMicros, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/micro", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.neuroMicro.images = [];
		for(const file of req.files) {
			req.body.neuroMicro.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.neuroMicro.author = {
			id: req.user._id,
			username: req.user.username
		}
		const neuroMicro = await NeuroMicro.create(req.body.neuroMicro);
		console.log(neuroMicro);
		res.redirect(`/Neurology/micro/${neuroMicro.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/micro/new", middleware.isLoggedIn, function(req, res){
	res.render("Neurology/micro/new");
});

//SHOW - revales more info about certain set
router.get("/micro/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	NeuroMicro.findById(req.params.id, function(err, foundNeuroMicro){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Neurology/micro/show", {neuroMicro: foundNeuroMicro});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/micro/:id/edit",  function(req,res){
		  NeuroMicro.findById(req.params.id, function(err, foundNeuroMicro){
    if(err){
      res.redirect("/Neurology/micro");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Neurology/micro/edit.ejs", {neuroMicro: foundNeuroMicro});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/micro/:id", function(req,res){
	
	NeuroMicro.findByIdAndUpdate(req.params.id, req.body.neuroMicro, function(err, updatedNeuroMicro){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Neurology/micro");
		} else {
			res.redirect("/Neurology/micro" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Neurology/micro");
      } else {
          res.redirect("/Neurology/micro");
      }
   });
});



											//Imaging ROUTES!!!
//INDEX route- show all sets
router.get("/imaging", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	NeuroImaging.find({}, function(err, allNeuroImagings){
		if(err){
			console.log(err);
		} else {
			res.render("Neurology/imaging/index", {neuroImagings:allNeuroImagings, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/imaging", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.neuroImaging.images = [];
		for(const file of req.files) {
			req.body.neuroImaging.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.neuroImaging.author = {
			id: req.user._id,
			username: req.user.username
		}
		const neuroImaging = await NeuroImaging.create(req.body.neuroImaging);
		console.log(neuroImaging);
		res.redirect(`/Neurology/imaging/${neuroImaging.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/imaging/new", middleware.isLoggedIn, function(req, res){
	res.render("Neurology/imaging/new");
});

//SHOW - revales more info about certain set
router.get("/imaging/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	NeuroImaging.findById(req.params.id, function(err, foundNeuroImaging){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Neurology/imaging/show", {neuroImaging: foundNeuroImaging});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/imaging/:id/edit",  function(req,res){
		  NeuroImaging.findById(req.params.id, function(err, foundNeuroImaging){
    if(err){
      res.redirect("/Neurology/Imaging");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Neurology/Imaging/edit.ejs", {neuroImaging: foundNeuroImaging});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/Imaging/:id", function(req,res){
	
	NeuroImaging.findByIdAndUpdate(req.params.id, req.body.neuroImaging, function(err, updatedNeuroImaging){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Neurology/Imaging");
		} else {
			res.redirect("/Neurology/Imaing" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Neurology/Imaging");
      } else {
          res.redirect("/Neurology/Imaging");
      }
   });
});


											//Histo ROUTES!!!
//INDEX route- show all sets
router.get("/histo", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	NeuroHisto.find({}, function(err, allNeuroHistos){
		if(err){
			console.log(err);
		} else {
			res.render("Neurology/histo/index", {neuroHistos:allNeuroHistos, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/histo", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.neuroHisto.images = [];
		for(const file of req.files) {
			req.body.neuroHisto.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.neuroHisto.author = {
			id: req.user._id,
			username: req.user.username
		}
		const neuroHisto = await NeuroHisto.create(req.body.neuroHisto);
		console.log(neuroHisto);
		res.redirect(`/Neurology/histo/${neuroHisto.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/histo/new", middleware.isLoggedIn, function(req, res){
	res.render("Neurology/histo/new");
});

//SHOW - revales more info about certain set
router.get("/histo/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	NeuroHisto.findById(req.params.id, function(err, foundNeuroHisto){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Neurology/histo/show", {neuroHisto: foundNeuroHisto});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/histo/:id/edit",  function(req,res){
		  NeuroHisto.findById(req.params.id, function(err, foundNeuroHisto){
    if(err){
      res.redirect("/Neurology/histo");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Neurology/histo/edit.ejs", {neuroHisto: foundNeuroHisto});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/histo/:id", function(req,res){
	
	NeuroHisto.findByIdAndUpdate(req.params.id, req.body.neuroHisto, function(err, updatedNeuroHisto){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Neurology/histo");
		} else {
			res.redirect("/Neurology/histo" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Neurology/histo");
      } else {
          res.redirect("/Neurology/histo");
      }
   });
});

												//Cyto ROUTES!!!
//INDEX route- show all sets
router.get("/cyto", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	NeuroCyto.find({}, function(err, allNeuroCytos){
		if(err){
			console.log(err);
		} else {
			res.render("Neurology/cyto/index", {neuroCytos:allNeuroCytos, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/cyto", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.neuroCyto.images = [];
		for(const file of req.files) {
			req.body.neuroCyto.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.neuroCyto.author = {
			id: req.user._id,
			username: req.user.username
		}
		const neuroCyto = await NeuroCyto.create(req.body.neuroCyto);
		console.log(neuroCyto);
		res.redirect(`/Neurology/cyto/${neuroCyto.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/cyto/new", middleware.isLoggedIn, function(req, res){
	res.render("Neurology/cyto/new");
});

//SHOW - revales more info about certain set
router.get("/cyto/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	NeuroCyto.findById(req.params.id, function(err, foundNeuroCyto){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Neurology/cyto/show", {neuroCyto: foundNeuroCyto});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/cyto/:id/edit",  function(req,res){
		  NeuroCyto.findById(req.params.id, function(err, foundNeuroCyto){
    if(err){
      res.redirect("/Neurology/cyto");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Neurology/cyto/edit.ejs", {neuroCyto: foundNeuroCyto});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/cyto/:id", function(req,res){
	
	NeuroCyto.findByIdAndUpdate(req.params.id, req.body.neuroCyto, function(err, updatedNeuroCyto){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Neurology/cyto");
		} else {
			res.redirect("/Neurology/cyto" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Neurology/cyto");
      } else {
          res.redirect("/Neurology/cyto");
      }
   });
});


											//Ct ROUTES!!!
//INDEX route- show all sets
router.get("/ct", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	NeuroCt.find({}, function(err, allNeuroCts){
		if(err){
			console.log(err);
		} else {
			res.render("Neurology/ct/index", {neuroCts:allNeuroCts, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/ct", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.neuroCt.images = [];
		for(const file of req.files) {
			req.body.neuroCt.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.neuroCt.author = {
			id: req.user._id,
			username: req.user.username
		}
		const neuroCt = await NeuroCt.create(req.body.neuroCt);
		console.log(neuroCt);
		res.redirect(`/Neurology/ct/${neuroCt.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/ct/new", middleware.isLoggedIn, function(req, res){
	res.render("Neurology/ct/new");
});

//SHOW - revales more info about certain set
router.get("/ct/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	NeuroCt.findById(req.params.id, function(err, foundNeuroCt){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Neurology/ct/show", {neuroCt: foundNeuroCt});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/ct/:id/edit",  function(req,res){
		  NeuroCt.findById(req.params.id, function(err, foundNeuroCt){
    if(err){
      res.redirect("/Neurology/ct");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Neurology/ct/edit.ejs", {neuroCt: foundNeuroCt});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/ct/:id", function(req,res){
	
	NeuroCt.findByIdAndUpdate(req.params.id, req.body.neuroCt, function(err, updatedNeuroCt){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Neurology/ct");
		} else {
			res.redirect("/Neurology/ct" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Neurology/ct");
      } else {
          res.redirect("/Neurology/ct");
      }
   });
});





















module.exports = router;
