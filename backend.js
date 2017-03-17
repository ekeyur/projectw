const express = require('express');
const multer = require('multer');
// const upload = multer({dest: 'uploads/'});
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const lineReader = require('line-reader');
// const uuidV1 = require('uuid/v1');
const eachLine = bluebird.promisify(lineReader.eachLine);
const app = express();
const config = require('./config');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, 'guests.csv');
  }
});

var upload = multer({ storage: storage })


app.use(express.static('static'));
app.use(bodyParser.json());

mongoose.connect(config.database);
// mongoose.connect('mongodb://localhost/hemguest');
// comment
mongoose.Promise = bluebird;

// MongoDb Schema
var guestSchema = new mongoose.Schema({
      fname : String,
      lname : String,
      garba : {
          invited : Boolean,
          rsvp : String,
          modified : Boolean,
          },
      mandvo : {
          invited : Boolean,
          rsvp : String,
          modified : Boolean,
          },
      wedding: {
            invited : Boolean,
            rsvp : String,
            modified : Boolean,
          },
      reception: {
            invited : Boolean,
            rsvp : String,
            modified : Boolean,
          },
      group  : String,
      city   : String
});

var Guest = mongoose.model('Guest',guestSchema);

// Query to retrieve all the guests
app.get('/allguests',function(request,response){
  Guest.find()
  .then(function(data){
    response.send(data);
  })
  .catch(function(err){
    console.log("Error", err);
  });
});

app.post('/login', function(request, response) {
   var user = request.body.user;
   var password = request.body.pass;
   if (user === 'nehem' && password == 'hemang123neha'){
     response.send('qwe123rty857hgs');
   }else{
     response.send('Login Failed');
   }
 });

 function auth(request, response, next) {
    //verify auth token
    let token = request.query.token;

    if (!token) {
      response.status(401);
      response.json({error: "You are not logged in"});
      return;
    }

    if(user.token === 'qwe123rty857hgs') {
        next();
      } else {
        response.status(401);
        response.json({error: "You are not logged in"});
      }
  }



// Search Query based on the userinput
app.get('/searchguests',function(request,response){
  // if(request.query.query.length >= 3){
  console.log(request.query);

    Guest.find({
      $and:[
        {'fname' : { $regex : new RegExp('\\b' + request.query.fname + '\\b', "i") }},
        {'lname' : { $regex : new RegExp('\\b' + request.query.lname + '\\b', "i") }}
      ]
    }
  )
    .then(function(data){
      return bluebird.map(data,function(g){
        return Guest.find({'group' : g.group});
      });
    })
    .then(function(data){
      response.send(data);
    })
    .catch(function(err){
      console.log(err.stack);
    });
  // }
});

//Add a single Guest API
app.post('/addguest',function(request,response){
  let data = request.body;

  let guest = new Guest({
    fname : data.fname,
    lname : data.lname,
    mandvo : {
        invited : data.mandvo,
        rsvp : "No Response",
        modified : false,
        },
    garba : {
        invited : data.garba,
        rsvp : "No Response",
        modified : false,
        },
    wedding: {
          invited : data.wedding,
          rsvp : "No Response",
          modified : false,
        },
    reception: {
          invited : data.reception,
          rsvp : "No Response",
          modified : false,
        },
    group  : data.group,
    city   : data.city
  });

  guest.save(Guest)
  .then(function(data){
    // console.log(data);
    response.send(data);
  })
  .catch(function(err){
    console.log("err",err);
  });
});

// Add Guests to Database from Uploaded csv file
app.post('/addguestsfromuploadedfile',function(request,response){
  var fileguests = [];
  eachLine('./uploads/guests.csv', function(line, last) {
    fileguests.push(line.split(','));
  })
  .then(function(){
    fileguests.forEach(function (g){
      let guest = new Guest({
        fname : g[0],
        lname : g[1],
        mandvo : {
            invited : g[4],
            rsvp : "No Response",
            modified : false,
            },
        garba : {
            invited : g[5],
            rsvp : "No Response",
            modified : false,
            },
        wedding: {
              invited : g[6],
              rsvp : "No Response",
              modified : false,
            },
        reception: {
              invited : g[7],
              rsvp : "No Response",
              modified : false,
            },
        group  : g[2],
        city   : g[3]
      });

      guest.save(Guest)
      .then(function(data){
        // console.log(data);
        response.send(data);
      })
      .catch(function(err){
        console.log("err",err);
      });
    });
  })
  .catch(function(err){
    console.log(err);
  });
});

app.post('/deleteallguests',function(request,response){
  Guest.remove()
  .then(function(data){
    response.send(data);
  })
  .catch(function(err){
    console.log("err",err);
  });
});

// app.post('/partyguests',function(request,response){
//   let group = request.body.group;
//   Guest.find({'group':group})
//   .then(function(data){
//     response.send(data);
//   })
//   .catch(function(err){
//     console.log("Err",err);
//   });
// });



app.post('/rsvpguest',function(request,response){
  let guests = request.body;
  console.log("Helloe");
  console.log(guests);
  bluebird.map(guests,function(g){
    return Guest.update(
      {'_id':g._id},
        {
          $set:
          {
          'mandvo': g.mandvo,
          'garba':  g.garba,
          'reception': g.reception,
          'wedding' : g.wedding
          }
        }
    );
  })
  .then(function(data){
    response.send(data);
  })
  .catch(function(err){
    console.log("Err",err);
  });
});


/// File Upload
app.post('/upload',upload.single('file') ,function(request, response) {
  response.end();
});


// Starting the Server
app.listen(config.port,function(){
  console.log("It's Showtime");
});
