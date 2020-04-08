var express = require("express");
var router = express.Router();
var GenitoMicro = require("../models/Genitourinary/genitoMicro");
var GenitoPatho = require("../models/Genitourinary/genitoPatho");
var GenitoImaging = require("../models/Genitourinary/genitoImaging");
var GenitoHisto = require("../models/Genitourinary/genitoHisto");
var GenitoCyto = require("../models/Genitourinary/genitoCyto");
var GenitoCt = require("../models/Genitourinary/genitoCt");
var User      = require("../models/user");
var middleware = require("../middleware");
var multer = require('multer');
var test = require('../middleware/upload');
var { cloudinary, storage } = require('../cloudinary');
var upload = multer({ storage });
router.get("/", middleware.isLoggedIn, (req, res) => {
 res.render("Genitourinary/subjects")
})
	

											//Patho ROUTES!!!
//INDEX route- show all sets
router.get("/patho", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	GenitoPatho.find({}, function(err, allGenitoPathos){
		if(err){
			console.log(err);
		} else {
			res.render("Genitourinary/patho/index", {genitoPathos:allGenitoPathos, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/patho", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.genitoPatho.images = [];
		for(const file of req.files) {
			req.body.genitoPatho.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.genitoPatho.author = {
			id: req.user._id,
			username: req.user.username
		}
		const genitoPatho = await GenitoPatho.create(req.body.genitoPatho);
		console.log(genitoPatho);
		res.redirect(`/Genitourinary/patho/${genitoPatho.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/patho/new", middleware.isLoggedIn, function(req, res){
	res.render("Genitourinary/patho/new");
});

//SHOW - revales more info about certain set
router.get("/patho/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	GenitoPatho.findById(req.params.id, function(err, foundGenitoPatho){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Genitourinary/patho/show", {genitoPatho: foundGenitoPatho});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/patho/:id/edit",  function(req,res){
		  GenitoPatho.findById(req.params.id, function(err, foundGenitoPatho){
    if(err){
      res.redirect("/Genitourinary/patho");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Genitourinary/patho/edit.ejs", {genitoPatho: foundGenitoPatho});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/patho/:id", function(req,res){
	
	GenitoPatho.findByIdAndUpdate(req.params.id, req.body.genitoPatho, function(err, updatedGenitoPatho){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Genitourinary/patho");
		} else {
			res.redirect("/Genitourinary/patho" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Genitourinary/patho");
      } else {
          res.redirect("/Genitourinary/patho");
      }
   });
});

											//Micro ROUTES!!!
//INDEX route- show all sets
router.get("/micro", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	GenitoMicro.find({}, function(err, allGenitoMicros){
		if(err){
			console.log(err);
		} else {
			res.render("Genitourinary/micro/index", {genitoMicros:allGenitoMicros, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/micro", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.genitoMicro.images = [];
		for(const file of req.files) {
			req.body.genitoMicro.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.genitoMicro.author = {
			id: req.user._id,
			username: req.user.username
		}
		const genitoMicro = await GenitoMicro.create(req.body.genitoMicro);
		console.log(genitoMicro);
		res.redirect(`/Genitourinary/micro/${genitoMicro.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/micro/new", middleware.isLoggedIn, function(req, res){
	res.render("Genitourinary/micro/new");
});

//SHOW - revales more info about certain set
router.get("/micro/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	GenitoMicro.findById(req.params.id, function(err, foundGenitoMicro){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Genitourinary/micro/show", {genitoMicro: foundGenitoMicro});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/micro/:id/edit",  function(req,res){
		  GenitoMicro.findById(req.params.id, function(err, foundGenitoMicro){
    if(err){
      res.redirect("/Genitourinary/micro");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Genitourinary/micro/edit.ejs", {genitoMicro: foundGenitoMicro});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/micro/:id", function(req,res){
	
	GenitoMicro.findByIdAndUpdate(req.params.id, req.body.genitoMicro, function(err, updatedGenitoMicro){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Genitourinary/micro");
		} else {
			res.redirect("/Genitourinary/micro" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Genitourinary/micro");
      } else {
          res.redirect("/Genitourinary/micro");
      }
   });
});



											//Imaging ROUTES!!!
//INDEX route- show all sets
router.get("/imaging", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	GenitoImaging.find({}, function(err, allGenitoImagings){
		if(err){
			console.log(err);
		} else {
			res.render("Genitourinary/imaging/index", {genitoImagings:allGenitoImagings, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/imaging", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.genitoImaging.images = [];
		for(const file of req.files) {
			req.body.genitoImaging.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.genitoImaging.author = {
			id: req.user._id,
			username: req.user.username
		}
		const genitoImaging = await GenitoImaging.create(req.body.genitoImaging);
		console.log(genitoImaging);
		res.redirect(`/Genitourinary/imaging/${genitoImaging.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/imaging/new", middleware.isLoggedIn, function(req, res){
	res.render("Genitourinary/imaging/new");
});

//SHOW - revales more info about certain set
router.get("/imaging/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	GenitoImaging.findById(req.params.id, function(err, foundGenitoImaging){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Genitourinary/imaging/show", {genitoImaging: foundGenitoImaging});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/imaging/:id/edit",  function(req,res){
		  GenitoImaging.findById(req.params.id, function(err, foundGenitoImaging){
    if(err){
      res.redirect("/Genitourinary/Imaging");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Genitourinary/Imaging/edit.ejs", {genitoImaging: foundGenitoImaging});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/Imaging/:id", function(req,res){
	
	GenitoImaging.findByIdAndUpdate(req.params.id, req.body.genitoImaging, function(err, updatedGenitoImaging){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Genitourinary/Imaging");
		} else {
			res.redirect("/Genitourinary/Imaing" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Genitourinary/Imaging");
      } else {
          res.redirect("/Genitourinary/Imaging");
      }
   });
});


											//Histo ROUTES!!!
//INDEX route- show all sets
router.get("/histo", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	GenitoHisto.find({}, function(err, allGenitoHistos){
		if(err){
			console.log(err);
		} else {
			res.render("Genitourinary/histo/index", {genitoHistos:allGenitoHistos, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/histo", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.genitoHisto.images = [];
		for(const file of req.files) {
			req.body.genitoHisto.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.genitoHisto.author = {
			id: req.user._id,
			username: req.user.username
		}
		const genitoHisto = await GenitoHisto.create(req.body.genitoHisto);
		console.log(genitoHisto);
		res.redirect(`/Genitourinary/histo/${genitoHisto.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/histo/new", middleware.isLoggedIn, function(req, res){
	res.render("Genitourinary/histo/new");
});

//SHOW - revales more info about certain set
router.get("/histo/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	GenitoHisto.findById(req.params.id, function(err, foundGenitoHisto){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Genitourinary/histo/show", {genitoHisto: foundGenitoHisto});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/histo/:id/edit",  function(req,res){
		  GenitoHisto.findById(req.params.id, function(err, foundGenitoHisto){
    if(err){
      res.redirect("/Genitourinary/histo");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Genitourinary/histo/edit.ejs", {genitoHisto: foundGenitoHisto});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/histo/:id", function(req,res){
	
	GenitoHisto.findByIdAndUpdate(req.params.id, req.body.genitoHisto, function(err, updatedGenitoHisto){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Genitourinary/histo");
		} else {
			res.redirect("/Genitourinary/histo" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Genitourinary/histo");
      } else {
          res.redirect("/Genitourinary/histo");
      }
   });
});

												//Cyto ROUTES!!!
//INDEX route- show all sets
router.get("/cyto", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	GenitoCyto.find({}, function(err, allGenitoCytos){
		if(err){
			console.log(err);
		} else {
			res.render("Genitourinary/cyto/index", {genitoCytos:allGenitoCytos, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/cyto", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.genitoCyto.images = [];
		for(const file of req.files) {
			req.body.genitoCyto.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.genitoCyto.author = {
			id: req.user._id,
			username: req.user.username
		}
		const genitoCyto = await GenitoCyto.create(req.body.genitoCyto);
		console.log(genitoCyto);
		res.redirect(`/Genitourinary/cyto/${genitoCyto.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/cyto/new", middleware.isLoggedIn, function(req, res){
	res.render("Genitourinary/cyto/new");
});

//SHOW - revales more info about certain set
router.get("/cyto/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	GenitoCyto.findById(req.params.id, function(err, foundGenitoCyto){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Genitourinary/cyto/show", {genitoCyto: foundGenitoCyto});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/cyto/:id/edit",  function(req,res){
		  GenitoCyto.findById(req.params.id, function(err, foundGenitoCyto){
    if(err){
      res.redirect("/Genitourinary/cyto");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Genitourinary/cyto/edit.ejs", {genitoCyto: foundGenitoCyto});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/cyto/:id", function(req,res){
	
	GenitoCyto.findByIdAndUpdate(req.params.id, req.body.genitoCyto, function(err, updatedGenitoCyto){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Genitourinary/cyto");
		} else {
			res.redirect("/Genitourinary/cyto" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Genitourinary/cyto");
      } else {
          res.redirect("/Genitourinary/cyto");
      }
   });
});


											//Ct ROUTES!!!
//INDEX route- show all sets
router.get("/ct", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	GenitoCt.find({}, function(err, allGenitoCts){
		if(err){
			console.log(err);
		} else {
			res.render("Genitourinary/ct/index", {genitoCts:allGenitoCts, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/ct", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.genitoCt.images = [];
		for(const file of req.files) {
			req.body.genitoCt.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.genitoCt.author = {
			id: req.user._id,
			username: req.user.username
		}
		const genitoCt = await GenitoCt.create(req.body.genitoCt);
		console.log(genitoCt);
		res.redirect(`/Genitourinary/ct/${genitoCt.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/ct/new", middleware.isLoggedIn, function(req, res){
	res.render("Genitourinary/ct/new");
});

//SHOW - revales more info about certain set
router.get("/ct/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	GenitoCt.findById(req.params.id, function(err, foundGenitoCt){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Genitourinary/ct/show", {genitoCt: foundGenitoCt});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/ct/:id/edit",  function(req,res){
		  GenitoCt.findById(req.params.id, function(err, foundGenitoCt){
    if(err){
      res.redirect("/Genitourinary/ct");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Genitourinary/ct/edit.ejs", {genitoCt: foundGenitoCt});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/ct/:id", function(req,res){
	
	GenitoCt.findByIdAndUpdate(req.params.id, req.body.genitoCt, function(err, updatedGenitoCt){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Genitourinary/ct");
		} else {
			res.redirect("/Genitourinary/ct" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Genitourinary/ct");
      } else {
          res.redirect("/Genitourinary/ct");
      }
   });
});





















module.exports = router;
