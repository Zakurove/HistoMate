var mongoose = require("mongoose");

// MSK SCHEMA
var mskMicroSchema = new mongoose.Schema({
	
		title: String,
	// image: String,
		 image: String,
   		imageId: String,
		images: [ {url: String, public_id: String} ],
	description: String,
	author: {
		id: {
		type: mongoose.Schema.Types.ObjectId,
	ref: "User"	
		},
	
		username: String 
	}	
	

});




module.exports = mongoose.model("MskMicro", mskMicroSchema);