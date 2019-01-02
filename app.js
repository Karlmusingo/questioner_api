
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
  const data = [];
  db.meetups.forEach(function(meetup) {
    data.push({
      id: meetup.id,
      location: meetup.location,
      topic: meetup.topic,
      happeningOn: meetup.happeningOn,
      tags: meetup.tags
    });
  });
  res.status(200).send({
    status: 200,
    data: data
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
        data: [{
          id: meetup.id,
          topic: meetup.topic,
          location: meetup.location,
          happeningOn: meetup.happeningOn,
          tags: meetup.tags
        }]
      })
    }
  });

  return res.status(404).send({
    status: 404,
    error: 'meetup not found'
  });
});

//get all upcoming meetups
app.get('/api/v1/meetups/upcoming/all', (req, res) => {
  var today = new Date();
  const upcomings = [];
  db.meetups.forEach((meetup) => {
    if(meetup.happeningOn > today){
      upcomings.push(meetup);
    }
  });
  res.status(200).send({
    status: 200,
    data: upcomings
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
    return res.status(400).send({
      status: 400,
      error: 'the body property is required'
    });
  } else if (!req.body.user) {
    return res.status(400).send({
      status: 400,
      error: 'the user property is required'
    });
  } else if (!req.body.meetup) {
    return res.status(400).send({
      status: 400,
      error: 'the meetup property is required'
    });
  }

  const question = {
    id: db.questions.length + 1,
    createdOn : new Date(),
    title: req.body.title,
    body: req.body.body,
    votes: 0,
    user: parseInt(req.body.user),
    meetup: parseInt(req.body.meetup)
  };

  db.questions.push(question);

  return res.status(201).send({
    status: 201,
    data:[{
      user: question.user,
      meetup: question.meetup,
      title: question.title,
      body: question.body
    }]
  });

});

//upvote a question
app.patch('/api/v1/questions/:id/upvote', (req, res) => {
  const id = parseInt(req.params.id, 10);
  db.questions.forEach(function (question) {
    if (question.id === id) {
      question.votes += 1;
      return res.status(200).send({
        status: 200,
        data:[{
          meetup: question.meetup,
          title: question.title,
          body: question.body,
          votes: question.votes
        }]
      });
    }
  });
  return res.status(404).send({
    status: 404,
    error: 'the question id is not found'
  });
});

//downvote a question
app.patch('/api/v1/questions/:id/downvote', (req, res) => {
  const id = parseInt(req.params.id, 10);
  db.questions.forEach(function (question) {
    if (question.id === id) {
      question.votes -= 1;
      return res.status(200).send({
        status: 200,
        data:[{
          meetup: question.meetup,
          title: question.title,
          body: question.body,
          votes: question.votes
        }]
      });
    }

  });
  return res.status(404).send({
    status: 404,
    error: 'the question id is not found'
  });
});

//respond to a meetup rsvp
app.post('/api/v1/meetups/:id/rsvps', (req, res) => {
  const id = parseInt(req.params.id, 10);

  if(!req.body.user){
    return res.status(400).send({
      status: 400,
      error: 'the user property is required in order to send an RSVP'
    });
  }else if (!req.body.status) {
    return res.status(400).send({
      status: 400,
      error: 'the status property is required in order to send an RSVP'
    });
  }

  db.meetups.forEach(function (meetup) {
    if(meetup.id === id){
      const rsvp = {
        id : db.rsvps.length + 1,
        meetup : meetup.id,
        user: parseInt(req.body.user),
        status: req.body.status
      };
      db.rsvps.push(rsvp);

      return res.status(201).send({
        status: 201,
        data: [{
          meetup: rsvp.meetup,
          topic: meetup.topic,
          status: rsvp.status
        }]
      });
    }
  });

  return res.status(404).send({
    status: 404,
    error: 'the meetup id provided is not found'
  });
});
//get questions for a specific meetup
app.get('/api/v1/questions/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  db.meetups.forEach(function (meetup) {
    if(meetup.id === id){
      const data = [];
      db.questions.forEach(function (question) {
        console.log(question);
        if(question.meetup === meetup.id){
          data.push(question);
        }
      });
      return res.status(200).send({
        status: 200,
        data: data
      });
    }
  });
  return res.status(404).send({
    status: 404,
    error : 'the meetup provided is not found'
  });
});

const PORT = 5000;
app.listen(process.env.PORT || PORT, () => {
  console.log(`server running on port ${PORT}`)
});
module.exports = app;
