var mongoose = require("mongoose");

// Cardio SCHEMA
var cardioSetSchema = new mongoose.Schema({
	title: String,
	image: String,
	description: String,
	author: {
		id: {
		type: mongoose.Schema.Types.ObjectId,
	ref: "User"	
		},
	
		username: String 
	}
});




module.exports = mongoose.model("CardioSet", cardioSetSchema);