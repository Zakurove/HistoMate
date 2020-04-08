var express = require("express");
var router = express.Router();
var EndoMicro = require("../models/Endocrine/endoMicro");
var EndoPatho = require("../models/Endocrine/endoPatho");
var EndoImaging = require("../models/Endocrine/endoImaging");
var EndoHisto = require("../models/Endocrine/endoHisto");
var EndoCyto = require("../models/Endocrine/endoCyto");
var EndoCt = require("../models/Endocrine/endoCt");
var User      = require("../models/user");
var middleware = require("../middleware");
var multer = require('multer');
var test = require('../middleware/upload');
var { cloudinary, storage } = require('../cloudinary');
var upload = multer({ storage });
router.get("/", middleware.isLoggedIn, (req, res) => {
 res.render("Endocrine/subjects")
})
	

											//Patho ROUTES!!!
//INDEX route- show all sets
router.get("/patho", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	EndoPatho.find({}, function(err, allEndoPathos){
		if(err){
			console.log(err);
		} else {
			res.render("Endocrine/patho/index", {endoPathos:allEndoPathos, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/patho", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.endoPatho.images = [];
		for(const file of req.files) {
			req.body.endoPatho.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.endoPatho.author = {
			id: req.user._id,
			username: req.user.username
		}
		const endoPatho = await EndoPatho.create(req.body.endoPatho);
		console.log(endoPatho);
		res.redirect(`/Endocrine/patho/${endoPatho.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/patho/new", middleware.isLoggedIn, function(req, res){
	res.render("Endocrine/patho/new");
});

//SHOW - revales more info about certain set
router.get("/patho/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	EndoPatho.findById(req.params.id, function(err, foundEndoPatho){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Endocrine/patho/show", {endoPatho: foundEndoPatho});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/patho/:id/edit",  function(req,res){
		  EndoPatho.findById(req.params.id, function(err, foundEndoPatho){
    if(err){
      res.redirect("/Endocrine/patho");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Endocrine/patho/edit.ejs", {endoPatho: foundEndoPatho});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/patho/:id", function(req,res){
	
	EndoPatho.findByIdAndUpdate(req.params.id, req.body.endoPatho, function(err, updatedEndoPatho){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Endocrine/patho");
		} else {
			res.redirect("/Endocrine/patho" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Endocrine/patho");
      } else {
          res.redirect("/Endocrine/patho");
      }
   });
});

											//Micro ROUTES!!!
//INDEX route- show all sets
router.get("/micro", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	EndoMicro.find({}, function(err, allEndoMicros){
		if(err){
			console.log(err);
		} else {
			res.render("Endocrine/micro/index", {endoMicros:allEndoMicros, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/micro", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.endoMicro.images = [];
		for(const file of req.files) {
			req.body.endoMicro.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.endoMicro.author = {
			id: req.user._id,
			username: req.user.username
		}
		const endoMicro = await EndoMicro.create(req.body.endoMicro);
		console.log(endoMicro);
		res.redirect(`/Endocrine/micro/${endoMicro.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/micro/new", middleware.isLoggedIn, function(req, res){
	res.render("Endocrine/micro/new");
});

//SHOW - revales more info about certain set
router.get("/micro/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	EndoMicro.findById(req.params.id, function(err, foundEndoMicro){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Endocrine/micro/show", {endoMicro: foundEndoMicro});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/micro/:id/edit",  function(req,res){
		  EndoMicro.findById(req.params.id, function(err, foundEndoMicro){
    if(err){
      res.redirect("/Endocrine/micro");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Endocrine/micro/edit.ejs", {endoMicro: foundEndoMicro});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/micro/:id", function(req,res){
	
	EndoMicro.findByIdAndUpdate(req.params.id, req.body.endoMicro, function(err, updatedEndoMicro){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Endocrine/micro");
		} else {
			res.redirect("/Endocrine/micro" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Endocrine/micro");
      } else {
          res.redirect("/Endocrine/micro");
      }
   });
});



											//Imaging ROUTES!!!
//INDEX route- show all sets
router.get("/imaging", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	EndoImaging.find({}, function(err, allEndoImagings){
		if(err){
			console.log(err);
		} else {
			res.render("Endocrine/imaging/index", {endoImagings:allEndoImagings, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/imaging", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.endoImaging.images = [];
		for(const file of req.files) {
			req.body.endoImaging.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.endoImaging.author = {
			id: req.user._id,
			username: req.user.username
		}
		const endoImaging = await EndoImaging.create(req.body.endoImaging);
		console.log(endoImaging);
		res.redirect(`/Endocrine/imaging/${endoImaging.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/imaging/new", middleware.isLoggedIn, function(req, res){
	res.render("Endocrine/imaging/new");
});

//SHOW - revales more info about certain set
router.get("/imaging/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	EndoImaging.findById(req.params.id, function(err, foundEndoImaging){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Endocrine/imaging/show", {endoImaging: foundEndoImaging});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/imaging/:id/edit",  function(req,res){
		  EndoImaging.findById(req.params.id, function(err, foundEndoImaging){
    if(err){
      res.redirect("/Endocrine/Imaging");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Endocrine/Imaging/edit.ejs", {endoImaging: foundEndoImaging});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/Imaging/:id", function(req,res){
	
	EndoImaging.findByIdAndUpdate(req.params.id, req.body.endoImaging, function(err, updatedEndoImaging){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Endocrine/Imaging");
		} else {
			res.redirect("/Endocrine/Imaing" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Endocrine/Imaging");
      } else {
          res.redirect("/Endocrine/Imaging");
      }
   });
});


											//Histo ROUTES!!!
//INDEX route- show all sets
router.get("/histo", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	EndoHisto.find({}, function(err, allEndoHistos){
		if(err){
			console.log(err);
		} else {
			res.render("Endocrine/histo/index", {endoHistos:allEndoHistos, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/histo", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.endoHisto.images = [];
		for(const file of req.files) {
			req.body.endoHisto.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.endoHisto.author = {
			id: req.user._id,
			username: req.user.username
		}
		const endoHisto = await EndoHisto.create(req.body.endoHisto);
		console.log(endoHisto);
		res.redirect(`/Endocrine/histo/${endoHisto.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/histo/new", middleware.isLoggedIn, function(req, res){
	res.render("Endocrine/histo/new");
});

//SHOW - revales more info about certain set
router.get("/histo/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	EndoHisto.findById(req.params.id, function(err, foundEndoHisto){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Endocrine/histo/show", {endoHisto: foundEndoHisto});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/histo/:id/edit",  function(req,res){
		  EndoHisto.findById(req.params.id, function(err, foundEndoHisto){
    if(err){
      res.redirect("/Endocrine/histo");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Endocrine/histo/edit.ejs", {endoHisto: foundEndoHisto});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/histo/:id", function(req,res){
	
	EndoHisto.findByIdAndUpdate(req.params.id, req.body.endoHisto, function(err, updatedEndoHisto){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Endocrine/histo");
		} else {
			res.redirect("/Endocrine/histo" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Endocrine/histo");
      } else {
          res.redirect("/Endocrine/histo");
      }
   });
});

												//Cyto ROUTES!!!
//INDEX route- show all sets
router.get("/cyto", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	EndoCyto.find({}, function(err, allEndoCytos){
		if(err){
			console.log(err);
		} else {
			res.render("Endocrine/cyto/index", {endoCytos:allEndoCytos, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/cyto", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.endoCyto.images = [];
		for(const file of req.files) {
			req.body.endoCyto.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.endoCyto.author = {
			id: req.user._id,
			username: req.user.username
		}
		const endoCyto = await EndoCyto.create(req.body.endoCyto);
		console.log(endoCyto);
		res.redirect(`/Endocrine/cyto/${endoCyto.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/cyto/new", middleware.isLoggedIn, function(req, res){
	res.render("Endocrine/cyto/new");
});

//SHOW - revales more info about certain set
router.get("/cyto/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	EndoCyto.findById(req.params.id, function(err, foundEndoCyto){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Endocrine/cyto/show", {endoCyto: foundEndoCyto});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/cyto/:id/edit",  function(req,res){
		  EndoCyto.findById(req.params.id, function(err, foundEndoCyto){
    if(err){
      res.redirect("/Endocrine/cyto");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Endocrine/cyto/edit.ejs", {endoCyto: foundEndoCyto});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/cyto/:id", function(req,res){
	
	EndoCyto.findByIdAndUpdate(req.params.id, req.body.endoCyto, function(err, updatedEndoCyto){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Endocrine/cyto");
		} else {
			res.redirect("/Endocrine/cyto" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Endocrine/cyto");
      } else {
          res.redirect("/Endocrine/cyto");
      }
   });
});


											//Ct ROUTES!!!
//INDEX route- show all sets
router.get("/ct", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	EndoCt.find({}, function(err, allEndoCts){
		if(err){
			console.log(err);
		} else {
			res.render("Endocrine/ct/index", {endoCts:allEndoCts, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/ct", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.endoCt.images = [];
		for(const file of req.files) {
			req.body.endoCt.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.endoCt.author = {
			id: req.user._id,
			username: req.user.username
		}
		const endoCt = await EndoCt.create(req.body.endoCt);
		console.log(endoCt);
		res.redirect(`/Endocrine/ct/${endoCt.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/ct/new", middleware.isLoggedIn, function(req, res){
	res.render("Endocrine/ct/new");
});

//SHOW - revales more info about certain set
router.get("/ct/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	EndoCt.findById(req.params.id, function(err, foundEndoCt){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Endocrine/ct/show", {endoCt: foundEndoCt});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/ct/:id/edit",  function(req,res){
		  EndoCt.findById(req.params.id, function(err, foundEndoCt){
    if(err){
      res.redirect("/Endocrine/ct");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Endocrine/ct/edit.ejs", {endoCt: foundEndoCt});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/ct/:id", function(req,res){
	
	EndoCt.findByIdAndUpdate(req.params.id, req.body.endoCt, function(err, updatedEndoCt){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Endocrine/ct");
		} else {
			res.redirect("/Endocrine/ct" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Endocrine/ct");
      } else {
          res.redirect("/Endocrine/ct");
      }
   });
});





















module.exports = router;
