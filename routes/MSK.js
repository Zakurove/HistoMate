var express = require("express");
var router = express.Router();
var MskMicro = require("../models/MSK/mskMicro");
var MskPatho = require("../models/MSK/mskPatho");
var MskImaging = require("../models/MSK/mskImaging");
var MskHisto = require("../models/MSK/mskHisto");
var MskCyto = require("../models/MSK/mskCyto");
var MskCt = require("../models/MSK/mskCt");
var User      = require("../models/user");
var middleware = require("../middleware");
var multer = require('multer');
var test = require('../middleware/upload');
var { cloudinary, storage } = require('../cloudinary');
var upload = multer({ storage });
router.get("/", middleware.isLoggedIn, (req, res) => {
 res.render("MSK/subjects")
})
	

											//Patho ROUTES!!!
//INDEX route- show all sets
router.get("/patho", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	MskPatho.find({}, function(err, allMskPathos){
		if(err){
			console.log(err);
		} else {
			res.render("MSK/patho/index", {mskPathos:allMskPathos, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/patho", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.mskPatho.images = [];
		for(const file of req.files) {
			req.body.mskPatho.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.mskPatho.author = {
			id: req.user._id,
			username: req.user.username
		}
		const mskPatho = await MskPatho.create(req.body.mskPatho);
		console.log(mskPatho);
		res.redirect(`/MSK/patho/${mskPatho.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/patho/new", middleware.isLoggedIn, function(req, res){
	res.render("MSK/patho/new");
});

//SHOW - revales more info about certain set
router.get("/patho/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	MskPatho.findById(req.params.id, function(err, foundMskPatho){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("MSK/patho/show", {mskPatho: foundMskPatho});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/patho/:id/edit",  function(req,res){
		  MskPatho.findById(req.params.id, function(err, foundMskPatho){
    if(err){
      res.redirect("/MSK/patho");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("MSK/patho/edit.ejs", {mskPatho: foundMskPatho});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/patho/:id", function(req,res){
	
	MskPatho.findByIdAndUpdate(req.params.id, req.body.mskPatho, function(err, updatedMskPatho){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/MSK/patho");
		} else {
			res.redirect("/MSK/patho" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/MSK/patho");
      } else {
          res.redirect("/MSK/patho");
      }
   });
});

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

//CREATE - add to DB
router.post("/micro", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.mskMicro.images = [];
		for(const file of req.files) {
			req.body.mskMicro.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.mskMicro.author = {
			id: req.user._id,
			username: req.user.username
		}
		const mskMicro = await MskMicro.create(req.body.mskMicro);
		console.log(mskMicro);
		res.redirect(`/MSK/micro/${mskMicro.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

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
			res.render("MSK/micro/show", {mskMicro: foundMskMicro});
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

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/MSK/micro");
      } else {
          res.redirect("/MSK/micro");
      }
   });
});



											//Imaging ROUTES!!!
//INDEX route- show all sets
router.get("/imaging", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	MskImaging.find({}, function(err, allMskImagings){
		if(err){
			console.log(err);
		} else {
			res.render("MSK/imaging/index", {mskImagings:allMskImagings, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/imaging", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.mskImaging.images = [];
		for(const file of req.files) {
			req.body.mskImaging.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.mskImaging.author = {
			id: req.user._id,
			username: req.user.username
		}
		const mskImaging = await MskImaging.create(req.body.mskImaging);
		console.log(mskImaging);
		res.redirect(`/MSK/imaging/${mskImaging.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/imaging/new", middleware.isLoggedIn, function(req, res){
	res.render("MSK/imaging/new");
});

//SHOW - revales more info about certain set
router.get("/imaging/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	MskImaging.findById(req.params.id, function(err, foundMskImaging){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("MSK/imaging/show", {mskImaging: foundMskImaging});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/imaging/:id/edit",  function(req,res){
		  MskImaging.findById(req.params.id, function(err, foundMskImaging){
    if(err){
      res.redirect("/MSK/Imaging");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("MSK/Imaging/edit.ejs", {mskImaging: foundMskImaging});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/Imaging/:id", function(req,res){
	
	MskImaging.findByIdAndUpdate(req.params.id, req.body.mskImaging, function(err, updatedMskImaging){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/MSK/Imaging");
		} else {
			res.redirect("/MSK/Imaing" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/MSK/Imaging");
      } else {
          res.redirect("/MSK/Imaging");
      }
   });
});


											//Histo ROUTES!!!
//INDEX route- show all sets
router.get("/histo", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	MskHisto.find({}, function(err, allMskHistos){
		if(err){
			console.log(err);
		} else {
			res.render("MSK/histo/index", {mskHistos:allMskHistos, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/histo", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.mskHisto.images = [];
		for(const file of req.files) {
			req.body.mskHisto.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.mskHisto.author = {
			id: req.user._id,
			username: req.user.username
		}
		const mskHisto = await MskHisto.create(req.body.mskHisto);
		console.log(mskHisto);
		res.redirect(`/MSK/histo/${mskHisto.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/histo/new", middleware.isLoggedIn, function(req, res){
	res.render("MSK/histo/new");
});

//SHOW - revales more info about certain set
router.get("/histo/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	MskHisto.findById(req.params.id, function(err, foundMskHisto){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("MSK/histo/show", {mskHisto: foundMskHisto});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/histo/:id/edit",  function(req,res){
		  MskHisto.findById(req.params.id, function(err, foundMskHisto){
    if(err){
      res.redirect("/MSK/histo");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("MSK/histo/edit.ejs", {mskHisto: foundMskHisto});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/histo/:id", function(req,res){
	
	MskHisto.findByIdAndUpdate(req.params.id, req.body.mskHisto, function(err, updatedMskHisto){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/MSK/histo");
		} else {
			res.redirect("/MSK/histo" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/MSK/histo");
      } else {
          res.redirect("/MSK/histo");
      }
   });
});

												//Cyto ROUTES!!!
//INDEX route- show all sets
router.get("/cyto", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	MskCyto.find({}, function(err, allMskCytos){
		if(err){
			console.log(err);
		} else {
			res.render("MSK/cyto/index", {mskCytos:allMskCytos, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/cyto", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.mskCyto.images = [];
		for(const file of req.files) {
			req.body.mskCyto.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.mskCyto.author = {
			id: req.user._id,
			username: req.user.username
		}
		const mskCyto = await MskCyto.create(req.body.mskCyto);
		console.log(mskCyto);
		res.redirect(`/MSK/cyto/${mskCyto.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/cyto/new", middleware.isLoggedIn, function(req, res){
	res.render("MSK/cyto/new");
});

//SHOW - revales more info about certain set
router.get("/cyto/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	MskCyto.findById(req.params.id, function(err, foundMskCyto){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("MSK/cyto/show", {mskCyto: foundMskCyto});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/cyto/:id/edit",  function(req,res){
		  MskCyto.findById(req.params.id, function(err, foundMskCyto){
    if(err){
      res.redirect("/MSK/cyto");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("MSK/cyto/edit.ejs", {mskCyto: foundMskCyto});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/cyto/:id", function(req,res){
	
	MskCyto.findByIdAndUpdate(req.params.id, req.body.mskCyto, function(err, updatedMskCyto){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/MSK/cyto");
		} else {
			res.redirect("/MSK/cyto" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/MSK/cyto");
      } else {
          res.redirect("/MSK/cyto");
      }
   });
});


											//Ct ROUTES!!!
//INDEX route- show all sets
router.get("/ct", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	MskCt.find({}, function(err, allMskCts){
		if(err){
			console.log(err);
		} else {
			res.render("MSK/ct/index", {mskCts:allMskCts, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/ct", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.mskCt.images = [];
		for(const file of req.files) {
			req.body.mskCt.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.mskCt.author = {
			id: req.user._id,
			username: req.user.username
		}
		const mskCt = await MskCt.create(req.body.mskCt);
		console.log(mskCt);
		res.redirect(`/MSK/ct/${mskCt.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/ct/new", middleware.isLoggedIn, function(req, res){
	res.render("MSK/ct/new");
});

//SHOW - revales more info about certain set
router.get("/ct/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	MskCt.findById(req.params.id, function(err, foundMskCt){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("MSK/ct/show", {mskCt: foundMskCt});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/ct/:id/edit",  function(req,res){
		  MskCt.findById(req.params.id, function(err, foundMskCt){
    if(err){
      res.redirect("/MSK/ct");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("MSK/ct/edit.ejs", {mskCt: foundMskCt});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/ct/:id", function(req,res){
	
	MskCt.findByIdAndUpdate(req.params.id, req.body.mskCt, function(err, updatedMskCt){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/MSK/ct");
		} else {
			res.redirect("/MSK/ct" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/MSK/ct");
      } else {
          res.redirect("/MSK/ct");
      }
   });
});





















module.exports = router;
