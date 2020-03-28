var mongoose = require("mongoose");

// Slide SCHEMA
var slideSchema = new mongoose.Schema({
	title: String,
	image: String,
	description: String,
	 notes: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Note"
      }
   ]
});

module.exports = mongoose.model("Slide", slideSchema);