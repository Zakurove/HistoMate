var mongoose = require("mongoose");

var mskCytoSchema = new mongoose.Schema({
	title: String,
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




module.exports = mongoose.model("MskCyto", mskCytoSchema);