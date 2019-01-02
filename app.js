
// Set up the express app
var express = require('express');
var meetups = require('./db/meetups');
var questions = require('./db/questions');
var users = require('./db/users');
var rsvp = require('./db/rsvp');

const app = express();
//get all meetups
app.get('/api/v1/meetups', (req, res) => {
  res.status(200).send({
    status: 200,
    data: meetups
  })
});
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});
