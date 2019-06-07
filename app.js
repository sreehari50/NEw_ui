const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const passport2 = require('passport');
const config = require('./config/database');
const historian=require('/home/mathul/fabric-dev-servers/land-registry/getHist');
mongoose.connect(config.database);
let db = mongoose.connection;

// Check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function(err){
  console.log(err);
});

// Init App
const app = express();

// Bring in Models
let Article = require('./models/article');
let Sell = require('./models/sell');
let Property = require('./models/property');
let Bank = require('./models/bank');

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));


// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});




// Home Route
app.get('/', function(req, res){
  Article.find({}, function(err, articles){
    if(err){
      console.log(err);
    } else {
      res.render('index', {
        title:'Articles',
        articles: articles
      });
    }
  });
});

// Public Route
app.get('/users/public', function(req, res){
  Sell.find({}, function(err, sells){
    if(err){
      console.log(err);
    } else {
      res.render('public', {
        sells: sells
      });
    }
  });
});

// prop sell route
app.get('/users/prop', function(req, res){
  Property.find({current_owner:req.user.username}, function(err, property){
    if(err){
      console.log(err);
    } else {
      res.render('prop', {
        property: property
      });
    }
  });
});

app.get('/articles/addd', function(req, res){
  res.render('add_buyer');
});



//already approved
app.get('/users/al', async function(req, res){
  result=await historian.landdetails();
  console.log("length:"+result.length);
  if(result != "empty")
{ console.log("empty") 
  res.render('al');}
  else{
    res.send("No Deeds were  approved");
  }
});

//yet to approve
app.get('/users/yet', function(req, res){
  Sell.find({approved:false,buyer_name:{ $ne:""}}, function(err, sells){
    if(err){
      console.log(err);
    } else {
      res.render('yet', {
        sells: sells
      });
    }
  });
});
app.get('/users/addp', function(req, res){
  res.render('add');
});

// Route Files
let articles = require('./routes/articles');
let users = require('./routes/users');
// let sells = require('./routes/articles');
app.use('/articles', articles);
app.use('/users', users);
// app.use('/sells', sells);

// Start Server
app.listen(4000, function(){
  console.log('Server started on port 4000...');
});
