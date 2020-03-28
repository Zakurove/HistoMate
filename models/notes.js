var mongoose = require("mongoose");
 
var noteSchema = new mongoose.Schema({
    text: String,
    author: String
});
 
module.exports = mongoose.model("Note", noteSchema);