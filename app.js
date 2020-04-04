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
	fs             = require("fs"),
	GridFsStorage  = require("multer-gridfs-storage"),
	multer         = require("multer"),
	crypto         = require("crypto"),
	db             = "mongodb://localhost/HistoMate",
	mongoURI       = "mongodb://localhost/HistoMate",
	vm             = require("v-response"),
	logger         = require('morgan')
	// cardioSetCreate = require("./helper/cardioSets.js"),
	// cardioSetshow = require("./helper/cardioSets.js")
	 // require('dotenv').config();
	// user_route     = require("./upload/user.route")
// Requiring Routes
var cardioSetsRoutes = require("./routes/cardioSets"),
    indexRoutes      = require("./routes/index"),
	MskRoutes        = require("./routes/MSK")

// mongoose.connect("mongodb://localhost/HistoMate");

//  mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true}). // Adding new mongo url parser
// then(() => console.log('MongoDB Connected...')).catch(err => console.log(err));

 // mongoose.connect(process.env.DATABASEURL);
require('dotenv').config();
mongoose.connect((db), {useFindAndModify: false, useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
    .then(() => vm.log("connected to mongoDB", db))
    .catch(err => vm.log("error mongodb", err));

app.use(logger('dev'));
app.use(bodyParser.json());
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
app.use("/MSK", MskRoutes);
// app.use(uploadRoutes);
// app.use(slidesRoutes);




// Serve static assets if in production


app.listen(3000, function() { 
  console.log('Histology LMS has started... '); 
});
// app.listen(process.env.PORT, process.env.IP, function() { 
//   console.log('Histology LMS has started... '); 

// });











