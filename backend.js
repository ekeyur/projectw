const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const lineReader = require('line-reader');
const eachLine = bluebird.promisify(lineReader.eachLine);
const app = express();


app.use(express.static('static'));
app.use(bodyParser.json());
app.use(fileUpload());

mongoose.connect('mongodb://localhost/hemguest');
mongoose.Promise = bluebird;

// MongoDb Schema
var guestSchema = new mongoose.Schema({
      fname : String,
      lname : String,
      garba : {
          invited : Boolean,
          rsvp : String,
          },
      mandvo : {
          invited : Boolean,
          rsvp : Boolean,
          modified : Boolean,
          },
      wedding: {
            invited : Boolean,
            rsvp : Boolean,
            modified : Boolean,
          },
      reception: {
            invited : Boolean,
            rsvp : Boolean,
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

// Search Query based on the userinput
app.get('/searchguests',function(request,response){
  if(request.query.query.length >= 3){
    Guest.find({'fname' : { $regex : new RegExp('\\b' + request.query.query + '\\b', "i") }})
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
  }
});

//Add a single Guest API
app.post('/addguest',function(request,response){
  let data = request.body;

  let guest = new Guest({
    fname : data.fname,
    lname : data.lname,
    mandvo : {
        invited : data.mandvo,
        rsvp : false,
        modified : false,
        },
    garba : {
        invited : data.garba,
        rsvp : false,
        modified : false,
        },
    wedding: {
          invited : data.wedding,
          rsvp : false,
          modified : false,
        },
    reception: {
          invited : data.reception,
          rsvp : false,
          modified: false,
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
  eachLine('guests.csv', function(line, last) {
    fileguests.push(line.split(','));
  })
  .then(function(){
    fileguests.forEach(function (g){
      let guest = new Guest({
        fname : g[0],
        lname : g[1],
        mandvo : {
            invited : g[4],
            rsvp : false,
            modified : false,
            },
        garba : {
            invited : g[5],
            rsvp : false,
            modified : false,
            },
        wedding: {
              invited : g[6],
              rsvp : false,
              modified : false,
            },
        reception: {
              invited : g[7],
              rsvp : false,
              modified: false,
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
  bluebird.map(guests,function(g){
    return Guest.update({'_id' : g._id},{$set : {'garba':g.garba, 'reception':g.reception, 'wedding' : g.wedding}})
  })
  .then(function(data){
    response.send(data);
  })
  .catch(function(err){
    console.log("Err",err);
  });
});


/// File Upload
app.post('/upload', function(request, response) {
  // console.log("Hola file upload");
  console.log(request.files.file);
  if (!request.files)
    return response.status(400).send('No files were uploaded.');

  // The name of the input field (i.e. "fileName") is used to retrieve the uploaded file
  let fileName = request.files.file;

  // Use the mv() method to place the file somewhere on your server
  fileName.mv('guests.csv', function(err) {
    if (err)
      return response.status(500).send(err);

    response.send('File uploaded!');
  });
});


// Starting the Server
app.listen('3000',function(){
  console.log("Server is running");
});
