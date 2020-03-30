var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
	flash          = require("connect-flash"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
	methodOverride = require("method-override"),
    CardioSet      = require("./models/cardioSet"),
    Slide          = require("./models/slides"),
    User           = require("./models/user"),
	fs             = require("fs")
	
	
// Requiring Routes
var cardioSetsRoutes = require("./routes/cardioSets"),
    slidesRoutes     = require("./routes/slides"),
    indexRoutes      = require("./routes/index")

// //MongoDB
// const db = "x";
// const MongoClient = require('mongodb').MongoClient;
// const uri = "x";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// //Connect to Mongo
// mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true}). // Adding new mongo url parser
// then(() => console.log('MongoDB Connected...')).catch(err => console.log(err));

// mongoose.connect("mongodb://localhost/HistoMate");
 
 mongoose.connect(process.env.DATABASEURL);

// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname));
app.use(methodOverride("_method"));
app.use (flash());
//Authenticaion 
app.use(require("express-session")({
	secret: "Three is wiser than one",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});



app.use(indexRoutes);
app.use("/cardioSets", cardioSetsRoutes);
// app.use(slidesRoutes);





// Serve static assets if in production


// app.listen(3000, function() { 
//   console.log('Histology LMS has started... '); 
// });
app.listen(process.env.PORT, process.env.IP, function() { 
  console.log('Histology LMS has started... '); 

});










// //UPLOOOAAD

// var	methodOverride = require("method-override"),
// 	formidable     = require("formidable"),
// 	assert         = require("assert"),
// 	path           = require("path"),
// 	multer         = require("multer"),
// 	config         = require("./atlas.js")
// var cors = require('cors');
// app.use(cors())

// var storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, './uploads');
//   },
//   filename: function(req, file, cb) {
//     cb(null, file.originalname);
//     console.log(file.originalname);
//   }
// })

// var multer = require('multer');
// var GridFsStorage = require('multer-gridfs-storage');
// var Grid = require('gridfs-stream');
// var upload = multer({storage: storage});
// app.post('/uploadDB', upload.single('file'), (req, res) => {
//   var filePath = './uploads/' + req.file.originalname;
//   client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     const db = client.db("test");
//     var bucket = new mongodb.GridFSBucket(db);
//     fs.createReadStream(filePath).pipe(bucket.openUploadStream(req.file.originalname)).on('error', function(error) {
//       console.log(error);
//     }).on('finish', function() {
//       console.log('done saving the file!');
//     });
//   });
//   return res.status(200).send(req.file)
// });
// app.post('/upload', function(req, res) {
//   console.log("server accc");
//   return res.status(200)

// });










