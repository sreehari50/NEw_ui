const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
var MongoClient = require('mongodb').MongoClient;
var historian=require('/home/mathul/fabric-dev-servers/land-registry/getHist');
const {spawn} = require('child_process');
// Bring in User Model
let User = require('../models/user');
let Property = require('../models/property');
let Sell = require('../models/sell');
let Bank = require('../models/bank');
// Register Form
router.get('/register', function(req, res){
  res.render('register');
});

// Register Proccess
router.post('/register', function(req, res){
  User.findOne({aadhar:req.body.aadhar}, function(err, user){
    if(!user){
    res.send ('invalid Adharnumber');
    }

     else {
  User.findOne({username:req.body.username}, function(err, user){
         if(user){
          res.send('username alredy taken ');
         }
         else{
  let upda_user = {};
  upda_user.name = req.body.name;
  upda_user.email = req.body.email;
  upda_user.aadhar = req.body.aadhar;
  upda_user.mobile = req.body.mobile;
  upda_user.username = req.body.username;
  upda_user.password = req.body.password;
  upda_user.password2 = req.body.password2;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('aadhar', 'Aadhar is required').notEmpty();
  req.checkBody('mobile', 'Mobile Number is required').notEmpty();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if(errors){
    res.render('register', {
      errors:errors
    });
  } else {
    // let newUser = new User({
    //   name:name,
    //   email:email,
    //   mobile:mobile,
    //   username:username,
    //   aadhar:aadhar,
    //   password:password
    // });

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(upda_user.password, salt, function(err, hash){
        if(err){
          console.log(err);
        }
        upda_user.password = hash;
        let query = {aadhar:req.body.aadhar}

        User.update(query, upda_user, function(err){
          if(err){
            console.log(err);
            return;
          } else {
            req.flash('success', 'You are now registered and can log in');
            res.redirect('/users/login');
          }
        });
        // newUser.save(function(err){
        //   if(err){
        //     console.log(err);
        //     return;
        //   } else {
        //     req.flash('success','You are now registered and can log in');
        //     res.redirect('/users/login');
        //   }
        // });
      });
    });
  }
}
});
}
});
});
// });

// Login Form
router.get('/login', function(req, res){
  res.render('login');
});

// Login Process
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/users/login',
    failureFlash: true
  })(req, res, next);
});

// Notary Login Form
router.get('/notary', function(req, res){
  res.render('notary');
});

// // notary Login Process
// router.post('/notary', function(req, res, next){
//   passport2.authenticate('local', {
//     successRedirect:'/',
//     failureRedirect:'/users/notary',
//     failureFlash: true
//   })(req, res, next);
// });



  router.post('/notary',function(req,res){
   MongoClient.connect('mongodb://localhost:27017/nodekb', function(err, db) {
    console.log(req.body.notusername);
   db.collection('notary').findOne({ notuser: req.body.notusername}, function(err, user) {
    console.log(user.notuser);
             if(!user){
               res.end("Login invalid");
            }else if (user.notuser === req.body.notusername && user.password === req.body.password){
              
            res.render('not');

          } else {
            console.log("Credentials wrong");
            res.end("Login invalid");
          }
   });
 });
});



// logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/login');
});


// Yet to approve
router.get('/yets', function(req, res){
  res.render('yets');
});

// Yet to approve
router.post('/yets', function(req, res){


     MongoClient.connect('mongodb://localhost:27017/nodekb', function(err, db) {
    db.collection('sells').findOne({ landid: req.body.lan,buyer_name:{ $ne:""}}, function(err, user) {
    
  if(user ===null)
          {
               res.end(" invalid landid");
            }
            else{
            if (err) throw err;
  var myquery = { approved: "false" };
  var newvalues = { landid:user.landid,aadhar:user.aadhar,previous_owner:user.previous_owner,current_owner:user.current_owner,mob:user.mob,cordinate_1:user.cordinate_1,cordinate_2:user.cordinate_2,area:user.area,tax_paid:user.tax_paid,liability:user.liability,price:user.price,buyer_name: user.buyer_name,approved:"true"};
  db.collection("sells").updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");
    db.close();
  });
  res.end("land is approved");
}
});

  });

});

//prop that u wnt to buy
router.get('/buy', function(req, res){
  res.render('buy');
});

router.post('/buys', function(req, res){
  
MongoClient.connect('mongodb://localhost:27017/nodekb', function(err, db) {
   
    db.collection('sells').findOne({ landid:req.body.idd},function(err, user) {
      var buyernamerep=user.buyer_name;
      if(user === null)
      {
        res.end("This land is not for sale");
      }
     else{
      

     
      
           if(user.buyer_name!==req.body.un){
            res.send(" there is no property to pay for you");
            }
            else if (user.buyer_name === req.body.un)
            {
              if(user.approved === "false")
              {
                res.send("notary is not approved your property");
              }
              else
              { 


             db.collection('users').findOne({username:user.buyer_name }, function(err, users) {
              

                db.collection('properties').findOne({ landid:user.landid},function(err, seller) {
                if(err) {
                  res.send("no such land");
                  throw err;
                }
                console.log(seller.address);
                cprocess =  spawn('node',['/home/mathul/fabric-dev-servers/land-registry/buyAsset.js',user.landid,user.buyer_name,users.aadhar],{stdio: [process.stdin, process.stdout, process.stderr]}
              )
              cprocess.on('exit', function (code) {
                console.log('child process exited with code ' + code.toString());
                
              var myquery = { landid:user.landid };
            var newvalues = { landid:seller.landid,aadhar:users.aadhar,previous_owner:seller.current_owner,current_owner:users.username,address:seller.address,mob:users.mobile,cordinate_1:seller.cordinate_1,cordinate_2:seller.cordinate_2,area:seller.area,tax_paid:seller.tax_paid,liability:seller.liability,price:seller.price};
            db.collection("properties").updateOne(myquery, newvalues, function(err, res) {
              if (err) throw err;
              console.log("1 document updated");
            });
            db.collection('sells').remove({landid:req.body.idd}, function(err, results) {

              res.send("ownership is changed");
              
          });
            
          });

            });
        
          });


            
       
        
                


          }
            }
            else{
               
              res.end("you are not the buyer");
            }
    
  }
  });
});


});

// add a property
router.get('/addpr', function(req, res){
  res.render('addpr');
});

// add a property
router.post('/addpr', function(req, res){

    req.checkBody('lid', 'Land  ID is required').notEmpty();
    req.checkBody('aadhar', 'Aadhar number is required').notEmpty();
    req.checkBody('prev', 'Previous owner name is required').notEmpty();
    req.checkBody('curr', 'Current owner name is required').notEmpty();
    req.checkBody('addr', 'Address is required').notEmpty();
    req.checkBody('mob', 'Mobile number is required').notEmpty();
    req.checkBody('cord1', 'Cordinate 1 is required').notEmpty();
    req.checkBody('cord2', 'Cordinate 2 is required').notEmpty();
    req.checkBody('area', 'Area is required').notEmpty();
    req.checkBody('tax', 'Tax status is required').notEmpty();
    req.checkBody('liab', 'liability is required').notEmpty();
    req.checkBody('price', 'price is required').notEmpty();

    var ob_data={'landid':req.body.lid,'aadhar':req.body.aadhar,address:req.body.addr,'previous_owner':req.body.prev,'current_owner':req.body.curr,'mob':req.body.mob,'cordinate_1':req.body.cord1,'cordinate_2':req.body.cord2,'area':req.body.area,'tax_paid':req.body.tax,'liability':req.body.liab,'price':req.body.price}
    var obj1=JSON.stringify(ob_data);
          console.log("Final reg Data : "+obj1);
          var jsonObj = JSON.parse(obj1);

     MongoClient.connect('mongodb://localhost:27017/nodekb', function(err, db) {

        db.collection("properties").findOne({landid: req.body.lid},function(err, suuser) {
           if (suuser === null)
           {
            db.collection("properties").insertOne(jsonObj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            

           });
            res.send("the land is added");
          }
          else{
      res.send("already the land is added ");
    }
     db.close();
  

  });

});
   });
module.exports = router;