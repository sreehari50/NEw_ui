const express = require('express');
const router = express.Router();
var MongoClient = require('mongodb').MongoClient;
// Article Model
let Article = require('../models/article');
// User Model
let User = require('../models/user');
//Sell Model
let Sell = require('../models/sell');
//Property Model
let Property = require('../models/property');
var historian=require('/home/mathul/fabric-dev-servers/land-registry/getHist');
const {spawn} = require('child_process');
let Bank =require('../models/bank');

// Add Route
// router.get('/add', ensureAuthenticated, function(req, res){
//   res.render('add_article', {
//     title:'Add Article'
//   });
// });

// // Add Submit POST Route
// router.post('/add', function(req, res){
//   req.checkBody('title','Title is required').notEmpty();
//   //req.checkBody('author','Author is required').notEmpty();
//   req.checkBody('body','Body is required').notEmpty();

//   // Get Errors
//   let errors = req.validationErrors();

//   if(errors){
//     res.render('add_article', {
//       title:'Add Article',
//       errors:errors
//     });
//   } else {
//     let article = new Article();
//     article.title = req.body.title;
//     article.author = req.user._id;
//     article.body = req.body.body;

//     article.save(function(err){
//       if(err){
//         console.log(err);
//         return;
//       } else {
//         req.flash('success','Article Added');
//         res.redirect('/');
//       }
//     });
//   }
// });



// Add buyer POST Route
router.post('/adb', function(req, res){
  req.checkBody('buyernam','Buyer name is required').notEmpty();
  req.checkBody('landidd','Land ID is required').notEmpty();

   MongoClient.connect('mongodb://localhost:27017/nodekb', function(err, db1) {
    db1.collection('sells').findOne({ landid: req.body.landidd}, function(err, user) {
    
              //changed
              if(user ===null)
              {
                res.end(" this land is not for sale");
             }
            // else if (userAadhaarno!==user.Aadhaarno) {
            //   res.end("you are not the owner of this land");}

      else{
            MongoClient.connect('mongodb://localhost:27017/nodekb', function(err, db) {
             db.collection('bank').findOne({ username: req.body.buyernam}, function(err, suser) {
              console.log(req.body.buyernam);
              console.log(suser);
              if(suser === null)
              {res.send("he is not a buyer");
              }
              else if(suser.balance<user.price)
              {
                res.send("buyer has not sufficient balance");
              }
              else {

            var myquery = { buyer_name:"" };
            var newvalues = { landid:user.landid,aadhar:user.aadhar,previous_owner:user.previous_owner,current_owner:user.current_owner,mob:user.mob,cordinate_1:user.cordinate_1,cordinate_2:user.cordinate_2,area:user.area,tax_paid:user.tax_paid,liability:user.liability,price:user.price,buyer_name: req.body.buyernam,approved:user.approved};
            db1.collection("sells").updateOne(myquery, newvalues, function(err, res) {
              if (err) throw err;
              console.log(user);
              console.log("1 document updated");
              global.buyername1=req.body.buyernam;
              db.close();
              db1.close();
            });
            res.end("buyer is added");
          }
        });
           });
}
});
  });





});




//dddqfqfqfefewffffffffffffffffffffffffffffwefffffffffffffffffffffffffffffffffffffffffffffffff



//faffaqffewwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww

// Load Edit Form
// router.get('/edit/:id', ensureAuthenticated, function(req, res){
//   Article.findById(req.params.id, function(err, article){
//     if(article.author != req.user._id){
//       req.flash('danger', 'Not Authorized');
//       res.redirect('/');
//     }
//     res.render('edit_article', {
//       title:'Edit Article',
//       article:article
//     });
//   });
// });

// Update Submit POST Route
// router.post('/edit/:id', function(req, res){
//   let article = {};
//   article.title = req.body.title;
//   article.author = req.body.author;
//   article.body = req.body.body;

//   let query = {_id:req.params.id}

//   Article.update(query, article, function(err){
//     if(err){
//       console.log(err);
//       return;
//     } else {
//       req.flash('success', 'Article Updated');
//       res.redirect('/');
//     }
//   });
// });

// Delete Article
// router.delete('/:id', function(req, res){
//   if(!req.user._id){
//     res.status(500).send();
//   }

//   let query = {_id:req.params.id}

//   Article.findById(req.params.id, function(err, article){
//     if(article.author != req.user._id){
//       res.status(500).send();
//     } else {
//       Article.remove(query, function(err){
//         if(err){
//           console.log(err);
//         }
//         res.send('Success');
//       });
//     }
//   });
// });

// // Get Single Article
// router.get('/:id', function(req, res){
//   Article.findById(req.params.id, function(err, article){
//     User.findById(article.author, function(err, user){
//       res.render('article', {
//         article:article,
//         author: user.name
//       });
//     });
//   });
// });



// Sell land
router.post('/sel', function(req, res){
  req.checkBody('land','Landid is required').notEmpty();

  MongoClient.connect('mongodb://localhost:27017/nodekb', function(err, db) {
   

    db.collection('properties').findOne({landid: req.body.land},function(err, users) {
      //changed
      if(users.current_owner!==req.user.username)
      {
        res.send("you dont own this property");
      }
      else if(users.liability!="no")
      {
        res.send("you canot sell this land due to liability issue");
      }
      else if(users.tax_paid!="yes")
      {
        res.send("you canot sell this land due to tax issue");
      }
      else{
          var ob_data={'landid':users.landid,'aadhar':users.aadhar,'previous_owner':users.previous_owner,'current_owner':users.current_owner,'mob':users.mob,'cordinate_1':users.cordinate_1,'cordinate_2':users.cordinate_2,'area':users.area,'tax_paid':users.tax_paid,'liability':users.liability,'price':users.price,'buyer_name': "",'approved':'false'}
           var obj1=JSON.stringify(ob_data);
          console.log("Final reg Data : "+obj1);
          var jsonObj = JSON.parse(obj1);
         MongoClient.connect('mongodb://localhost:27017/nodekb', function(err, db) {
          //changed
        db.collection("sells").findOne({landid: req.body.land},function(err, suuser) {
           if (suuser === null)
           {cprocess =  spawn('node',['/home/mathul/fabric-dev-servers/land-registry/ret.js',users.landid,],{stdio: [process.stdin, process.stdout, process.stderr]}
           )
           /*cprocess.stdout.on('data', function (data) {
             console.log('stdout: ' + data.toString());
             });
             
             cprocess.stderr.on('data', function (data) {
             console.log('stderr: ' + data.toString());
             });*/
             
             cprocess.on('exit', function (code) {
              if(code==0){
             console.log('child process exited with code ' + code.toString());
             console.log("dbsucces");
             MongoClient.connect('mongodb://localhost:27017/nodekb', function(err, db){
            db.collection("sells").insertOne(jsonObj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            

           });
          });
            res.send("your land is now for sale");
        }
          });
          }
          else{
      res.send("already the land is for sale ");
    }
     db.close();
   });

      });
}

  });

 });



});


// Sell land
router.post('/cancel', function(req, res){
  req.checkBody('landi','Landid is required').notEmpty();

     MongoClient.connect('mongodb://localhost:27017/nodekb', function(err, db) {
   

    db.collection('sells').findOne({ landid:req.body.landi},function(err, user) {
      console.log(user)
           if(user === null){
               res.send("your land is not for sale now");
            }else {
              db.collection('sells').remove({landid:req.body.landi}, function(err, results) {
                 res.send("your land is removed from sale");
            console.log(results.result);
        });
       
        db.close();
    }
});
    });


});


router.post('/change', function(req, res){
  req.checkBody('landz','Landid is required').notEmpty();
  req.checkBody('pric','price is required').notEmpty();

     MongoClient.connect('mongodb://localhost:27017/nodekb', function(err, db) {
   

    db.collection('sells').findOne({ landid:req.body.landz,},function(err, user) {
      console.log(user)
           if(user === null){
               res.send("invalid landid");
              
            }
            else if(user.buyer_name !== "")
            {
              res.send("cannot change price since buyer is already added");
            }
            
            else {
              

            var myquery = { price:user.price };
            var newvalues = { landid:user.landid,aadhar:user.aadhar,previous_owner:user.previous_owner,current_owner:user.current_owner,mob:user.mob,cordinate_1:user.cordinate_1,cordinate_2:user.cordinate_2,area:user.area,tax_paid:user.tax_paid,liability:user.liability,price:req.body.pric,buyer_name:user.buyer_name,approved:user.approved};
            eprocess =  spawn('node',['/home/mathul/fabric-dev-servers/land-registry/changeprice.js',parseFloat(req.body.pric),user.landid],{stdio: [process.stdin, process.stdout, process.stderr]}
            )
            /*cprocess.stdout.on('data', function (data) {
              console.log('stdout: ' + data.toString());
              });
              
              cprocess.stderr.on('data', function (data) {
              console.log('stderr: ' + data.toString());
              });*/
              
              eprocess.on('exit', function (code) {
              console.log('child process exited with code ' + code.toString());
              
            MongoClient.connect('mongodb://localhost:27017/nodekb', function(err, db) {
            db.collection("sells").updateOne(myquery, newvalues, function(err, res) {
              if (err) throw err;
              console.log("1 document updated");
              var newmy ={landid:user.landid};
              var newval={landid:user.landid,aadhar:user.aadhar,previous_owner:user.previous_owner,current_owner:user.current_owner,mob:user.mob,cordinate_1:user.cordinate_1,cordinate_2:user.cordinate_2,area:user.area,tax_paid:user.tax_paid,liability:user.liability,price:req.body.pric};
              db.collection('properties').updateOne(newmy,newval,function(err, res){
                if (err) throw err;
                console.log("1 document updated");
              });

              
            });
          });
          res.send("price changed");
        });
                 
        
       
        db.close();
    }
});
    });


});

// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;




