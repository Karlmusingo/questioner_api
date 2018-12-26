
// Set up the express app
var express = require('express');
var bodyParser = require('body-parser');
var db = require('./db/db');


const app = express();

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//get all meetups
app.get('/api/v1/meetups', (req, res) => {
  res.status(200).send({
    status: 200,
    data: db.meetups
  })
});


//creating a new meetup
app.post('/api/v1/meetups', (req, res) => {

  if(!req.body.location) {
    return res.status(400).send({
      status: 400,
      error: 'location property is required for the meetup'
    });
  } else if(!req.body.topic) {
    return res.status(400).send({
      status: 400,
      error: 'topic property is required for the meetup'
    });
  }else if(!req.body.happeningOn){
    return res.status(400).send({
      status: 400,
      error: 'happeningOn property is required for the meetup'
    });
  }
 const meetup = {
   id: db.meetups.length + 1,
   createdOn: new Date(),
   location: req.body.location,
   topic: req.body.topic,
   happeningOn: new Date(req.body.happeningOn)
 }
 db.meetups.push(meetup);
 return res.status(201).send({
   status: 201,
   data: [meetup]
 })
});

//get a specific meetup
app.get('/api/v1/meetups/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  db.meetups.forEach(function(meetup){
    if(meetup.id === id){
      return res.status(200).send({
        status: 200,
        data: [meetup]
      })
    }
  });

  return res.status(404).send({
    status: 404,
    error: 'meetup not found'
  });
});

//get all upcoming meetups
app.get('/api/v1/meetups/upcoming', (req, res) => {
  var today = new Date();
  const upcomings = db.meetups.map(function(meetup){
    if(meetup.happeningOn > today){
      return meetup;
    }
    res.status(200).send({
      status: 200,
      data: upcomings
    });
  });
});

//create a question record
app.post('/api/v1/questions', (req, res) => {
  if(!req.body.title){
    return res.status(400).send({
      status: 400,
      error: 'the title property is required'
    });
  } else if (!req.body.body) {
    return res.status(400).send(
      status: 400,
      error: 'the body property is required'
    );
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});
module.exports = app;
