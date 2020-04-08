var express = require("express");
var router = express.Router();
var RespMicro = require("../models/Respiratory/respMicro");
var RespPatho = require("../models/Respiratory/respPatho");
var RespImaging = require("../models/Respiratory/respImaging");
var RespHisto = require("../models/Respiratory/respHisto");
var RespCyto = require("../models/Respiratory/respCyto");
var RespCt = require("../models/Respiratory/respCt");
var User      = require("../models/user");
var middleware = require("../middleware");
var multer = require('multer');
var test = require('../middleware/upload');
var { cloudinary, storage } = require('../cloudinary');
var upload = multer({ storage });
router.get("/", middleware.isLoggedIn, (req, res) => {
 res.render("Respiratory/subjects")
})
	

											//Patho ROUTES!!!
//INDEX route- show all sets
router.get("/patho", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	RespPatho.find({}, function(err, allRespPathos){
		if(err){
			console.log(err);
		} else {
			res.render("Respiratory/patho/index", {respPathos:allRespPathos, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/patho", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.respPatho.images = [];
		for(const file of req.files) {
			req.body.respPatho.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.respPatho.author = {
			id: req.user._id,
			username: req.user.username
		}
		const respPatho = await RespPatho.create(req.body.respPatho);
		console.log(respPatho);
		res.redirect(`/Respiratory/patho/${respPatho.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/patho/new", middleware.isLoggedIn, function(req, res){
	res.render("Respiratory/patho/new");
});

//SHOW - revales more info about certain set
router.get("/patho/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	RespPatho.findById(req.params.id, function(err, foundRespPatho){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Respiratory/patho/show", {respPatho: foundRespPatho});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/patho/:id/edit",  function(req,res){
		  RespPatho.findById(req.params.id, function(err, foundRespPatho){
    if(err){
      res.redirect("/Respiratory/patho");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Respiratory/patho/edit.ejs", {respPatho: foundRespPatho});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/patho/:id", function(req,res){
	
	RespPatho.findByIdAndUpdate(req.params.id, req.body.respPatho, function(err, updatedRespPatho){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Respiratory/patho");
		} else {
			res.redirect("/Respiratory/patho" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Respiratory/patho");
      } else {
          res.redirect("/Respiratory/patho");
      }
   });
});

											//Micro ROUTES!!!
//INDEX route- show all sets
router.get("/micro", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	RespMicro.find({}, function(err, allRespMicros){
		if(err){
			console.log(err);
		} else {
			res.render("Respiratory/micro/index", {respMicros:allRespMicros, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/micro", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.respMicro.images = [];
		for(const file of req.files) {
			req.body.respMicro.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.respMicro.author = {
			id: req.user._id,
			username: req.user.username
		}
		const respMicro = await RespMicro.create(req.body.respMicro);
		console.log(respMicro);
		res.redirect(`/Respiratory/micro/${respMicro.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/micro/new", middleware.isLoggedIn, function(req, res){
	res.render("Respiratory/micro/new");
});

//SHOW - revales more info about certain set
router.get("/micro/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	RespMicro.findById(req.params.id, function(err, foundRespMicro){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Respiratory/micro/show", {respMicro: foundRespMicro});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/micro/:id/edit",  function(req,res){
		  RespMicro.findById(req.params.id, function(err, foundRespMicro){
    if(err){
      res.redirect("/Respiratory/micro");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Respiratory/micro/edit.ejs", {respMicro: foundRespMicro});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/micro/:id", function(req,res){
	
	RespMicro.findByIdAndUpdate(req.params.id, req.body.respMicro, function(err, updatedRespMicro){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Respiratory/micro");
		} else {
			res.redirect("/Respiratory/micro" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Respiratory/micro");
      } else {
          res.redirect("/Respiratory/micro");
      }
   });
});



											//Imaging ROUTES!!!
//INDEX route- show all sets
router.get("/imaging", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	RespImaging.find({}, function(err, allRespImagings){
		if(err){
			console.log(err);
		} else {
			res.render("Respiratory/imaging/index", {respImagings:allRespImagings, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/imaging", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.respImaging.images = [];
		for(const file of req.files) {
			req.body.respImaging.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.respImaging.author = {
			id: req.user._id,
			username: req.user.username
		}
		const respImaging = await RespImaging.create(req.body.respImaging);
		console.log(respImaging);
		res.redirect(`/Respiratory/imaging/${respImaging.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/imaging/new", middleware.isLoggedIn, function(req, res){
	res.render("Respiratory/imaging/new");
});

//SHOW - revales more info about certain set
router.get("/imaging/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	RespImaging.findById(req.params.id, function(err, foundRespImaging){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Respiratory/imaging/show", {respImaging: foundRespImaging});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/imaging/:id/edit",  function(req,res){
		  RespImaging.findById(req.params.id, function(err, foundRespImaging){
    if(err){
      res.redirect("/Respiratory/Imaging");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Respiratory/Imaging/edit.ejs", {respImaging: foundRespImaging});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/Imaging/:id", function(req,res){
	
	RespImaging.findByIdAndUpdate(req.params.id, req.body.respImaging, function(err, updatedRespImaging){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Respiratory/Imaging");
		} else {
			res.redirect("/Respiratory/Imaing" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Respiratory/Imaging");
      } else {
          res.redirect("/Respiratory/Imaging");
      }
   });
});


											//Histo ROUTES!!!
//INDEX route- show all sets
router.get("/histo", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	RespHisto.find({}, function(err, allRespHistos){
		if(err){
			console.log(err);
		} else {
			res.render("Respiratory/histo/index", {respHistos:allRespHistos, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/histo", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.respHisto.images = [];
		for(const file of req.files) {
			req.body.respHisto.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.respHisto.author = {
			id: req.user._id,
			username: req.user.username
		}
		const respHisto = await RespHisto.create(req.body.respHisto);
		console.log(respHisto);
		res.redirect(`/Respiratory/histo/${respHisto.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/histo/new", middleware.isLoggedIn, function(req, res){
	res.render("Respiratory/histo/new");
});

//SHOW - revales more info about certain set
router.get("/histo/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	RespHisto.findById(req.params.id, function(err, foundRespHisto){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Respiratory/histo/show", {respHisto: foundRespHisto});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/histo/:id/edit",  function(req,res){
		  RespHisto.findById(req.params.id, function(err, foundRespHisto){
    if(err){
      res.redirect("/Respiratory/histo");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Respiratory/histo/edit.ejs", {respHisto: foundRespHisto});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/histo/:id", function(req,res){
	
	RespHisto.findByIdAndUpdate(req.params.id, req.body.respHisto, function(err, updatedRespHisto){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Respiratory/histo");
		} else {
			res.redirect("/Respiratory/histo" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Respiratory/histo");
      } else {
          res.redirect("/Respiratory/histo");
      }
   });
});

												//Cyto ROUTES!!!
//INDEX route- show all sets
router.get("/cyto", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	RespCyto.find({}, function(err, allRespCytos){
		if(err){
			console.log(err);
		} else {
			res.render("Respiratory/cyto/index", {respCytos:allRespCytos, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/cyto", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.respCyto.images = [];
		for(const file of req.files) {
			req.body.respCyto.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.respCyto.author = {
			id: req.user._id,
			username: req.user.username
		}
		const respCyto = await RespCyto.create(req.body.respCyto);
		console.log(respCyto);
		res.redirect(`/Respiratory/cyto/${respCyto.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/cyto/new", middleware.isLoggedIn, function(req, res){
	res.render("Respiratory/cyto/new");
});

//SHOW - revales more info about certain set
router.get("/cyto/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	RespCyto.findById(req.params.id, function(err, foundRespCyto){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Respiratory/cyto/show", {respCyto: foundRespCyto});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/cyto/:id/edit",  function(req,res){
		  RespCyto.findById(req.params.id, function(err, foundRespCyto){
    if(err){
      res.redirect("/Respiratory/cyto");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Respiratory/cyto/edit.ejs", {respCyto: foundRespCyto});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/cyto/:id", function(req,res){
	
	RespCyto.findByIdAndUpdate(req.params.id, req.body.respCyto, function(err, updatedRespCyto){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Respiratory/cyto");
		} else {
			res.redirect("/Respiratory/cyto" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Respiratory/cyto");
      } else {
          res.redirect("/Respiratory/cyto");
      }
   });
});


											//Ct ROUTES!!!
//INDEX route- show all sets
router.get("/ct", middleware.isLoggedIn, function(req, res){
	
	//Get Sets from DB
	RespCt.find({}, function(err, allRespCts){
		if(err){
			console.log(err);
		} else {
			res.render("Respiratory/ct/index", {respCts:allRespCts, currentUser: req.user});
		}
	});
});

//CREATE - add to DB
router.post("/ct", middleware.isLoggedIn, upload.array('images', 4), async function(req, res) {
	try {
		console.log(req.files);
		req.body.respCt.images = [];
		for(const file of req.files) {
			req.body.respCt.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		// add author
		req.body.respCt.author = {
			id: req.user._id,
			username: req.user.username
		}
		const respCt = await RespCt.create(req.body.respCt);
		console.log(respCt);
		res.redirect(`/Respiratory/ct/${respCt.id}`);
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

//NEW - show form to create a new set
router.get("/ct/new", middleware.isLoggedIn, function(req, res){
	res.render("Respiratory/ct/new");
});

//SHOW - revales more info about certain set
router.get("/ct/:id", middleware.isLoggedIn, function(req, res){
	//find set with provided id
	RespCt.findById(req.params.id, function(err, foundRespCt){
		if(err){
			console.log(err);
		} else { 
			//render page of the set
			res.render("Respiratory/ct/show", {respCt: foundRespCt});
		}	
	});
})

//EDIT - transfers to the editing page of the set
router.get("/ct/:id/edit",  function(req,res){
		  RespCt.findById(req.params.id, function(err, foundRespCt){
    if(err){
      res.redirect("/Respiratory/ct");  
    } else {
		req.flash("success", "Successfully edited set!")
      res.render("Respiratory/ct/edit.ejs", {respCt: foundRespCt});
    }
  });
})

//UPDATE - write the new info in the EDIT page on top of the old info then reroutes
router.put("/ct/:id", function(req,res){
	
	RespCt.findByIdAndUpdate(req.params.id, req.body.respCt, function(err, updatedRespCt){
		if(err){
			console.log("ERROR IN UPDATE");
			res.redirect("/Respiratory/ct");
		} else {
			res.redirect("/Respiratory/ct" + req.params.id);
		}
	});
});

// DESTROY 
router.delete("/:id",  function(req, res){
   CardioSet.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Respiratory/ct");
      } else {
          res.redirect("/Respiratory/ct");
      }
   });
});





















module.exports = router;
