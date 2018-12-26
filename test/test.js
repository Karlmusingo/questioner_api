//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const db = require("../db/db");

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('meetups', () => {
  //Before each test we empty the database
    before((done) => {
      db.meetups.forEach(function() {
        db.meetups.pop();
        done();
      });
    });
/*
  * Test the GET /api/v1/meetups route
  */
  describe('GET /api/v1/meetups', () => {
      it('it should GET all the meetups', (done) => {
        chai.request(app)
            .get('/api/v1/meetups')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.status.should.be.eql(200);
                  res.body.data.should.be.a('array');
                  res.body.data.length.should.be.eql(0);
              done();
            });
      });
  });

  /*
    * Test the GET /api/v1/meetups/:id route
    */
    describe('GET /api/v1/meetups/:id', () => {

        it('it should GET a meetup by the id given', (done) => {

          var meetup = {
            id: db.meetups.length + 1,
            createdOn: new Date(),
            location: 'KIST',
            topic: 'Intro to Git and GitHub',
            happeningOn: new Date("10/11/2019")
          };
          db.meetups.push(meetup);
          chai.request(app)
                .get('/api/v1/meetups/'+meetup.id)
                .end((err, res) => {
                      res.should.have.status(200);
                      res.body.status.should.be.eql(200);
                      res.body.data.should.be.a('array');
                      res.body.data[0].should.have.property('createdOn');
                      res.body.data[0].should.have.property('location');
                      res.body.data[0].should.have.property('topic');
                      res.body.data[0].should.have.property('happeningOn');
                      res.body.data.length.should.be.eql(meetup.id);
                  done();
                });

        });
    });
    /*
    *Test the POST /api/v1/meetups route
    */
    describe("POST /api/v1/meetups", () => {
      it('it should not POST a meetup without location, topic or happeningOn fields', (done) => {
        const meetup = {
          id: db.meetups.length + 1,
          createdOn: new Date(),
          topic: 'Intro to Git and GitHub',
          happeningOn: new Date("10/11/2019")
        };
        chai.request(app)
            .post('/api/v1/meetups')
            .send(meetup)
            .end((err, res) => {
                  res.should.have.status(400);
                  res.body.should.be.a('object');
                  res.body.should.have.property('error');
              done();
            });
      });

      it('it should POST a meetup ', (done) => {
        const meetup = {
          id: db.meetups.length + 1,
          createdOn: new Date(),
          location: 'KIST',
          topic: 'Intro to Git and GitHub',
          happeningOn: new Date("10/11/2019")
        };
        chai.request(app)
            .post('/api/v1/meetups')
            .send(meetup)
            .end((err, res) => {
              res.should.have.status(201);
              res.body.status.should.be.eql(201);
              res.body.data.should.be.a('array');
              res.body.data[0].should.have.property('createdOn');
              res.body.data[0].should.have.property('location');
              res.body.data[0].should.have.property('topic');
              res.body.data[0].should.have.property('happeningOn');
              res.body.data.length.should.be.eql(1);
              done();
            });
      });
    });

    /*
    *Test the POST /api/v1/questions route
    */
    describe('POST /api/v1/questions', () => {
      it('it should not post a question without the title, the body, user or meetup', (done) => {
        const question = {
          id: db.questions.length + 1,
          createdOn: new Date(),
          title: 'How to do',
          body:'I need to know how to host a api on Heroku'
        };
        chai.request(app)
            .post('/api/v1/questions')
            .send(question)
            .end((err, res) => {
                  res.should.have.status(400);
                  res.body.should.be.a('object');
                  res.body.should.have.property('error');
              done();
            });
      });

      it('it should POST a question ', (done) => {
        const question = {
          id: db.questions.length + 1,
          createdOn: new Date(),
          title: 'How to do',
          body:'I need to know how to host a api on Heroku',
          user: 1,
          meetup: 1
        };
        chai.request(app)
            .post('/api/v1/questions')
            .send(question)
            .end((err, res) => {
              res.should.have.status(201);
              res.body.status.should.be.eql(201);
              res.body.data.should.be.a('array');
              res.body.data.length.should.be.eql(1);
              res.body.data[0].should.have.property('user');
              res.body.data[0].should.have.property('meetup');
              res.body.data[0].should.have.property('title');
              res.body.data[0].should.have.property('body');
              done();
            });
      });
    });

    /*
    * PATCH /api/v1/questions/:id/upvote
    */
    describe('PATCH /api/v1/questions/:id/upvote', () => {
      it('it should increase the vote property for the question specified by :id', (done) => {
        const question = {
          id: db.questions.length + 1,
          createdOn: new Date(),
          title: 'How to do',
          body:'I need to know how to host a api on Heroku',
          vote:2
        };
        db.questions.push(question);
        chai.request(app)
              .patch('/api/v1/questions/'+ question.id +'/upvote')
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.status.should.be.eql(200);
                    res.body.data.should.be.a('array');
                    res.body.data.length.should.be.eql(1);
                    res.body.data[0].should.have.property('meetup');
                    res.body.data[0].should.have.property('title');
                    res.body.data[0].should.have.property('body');
                    res.body.data[0].should.have.property('votes').eql(question.vote + 1);
                    res.body.data[0].should.have.property('id').eql(meetup.id);
                done();
              });


      });
    });

    /*
    * PATCH /api/v1/questions/:id/downvote
    */
    describe('PATCH /api/v1/questions/:id/downvote', () => {
      it('it should decrease the vote property for the question specified by :id', (done) => {
        const question = {
          id: db.questions.length + 1,
          createdOn: new Date(),
          title: 'How to do',
          body:'I need to know how to host a api on Heroku',
          vote:2
        };
        db.questions.push(question);
        chai.request(app)
              .patch('/api/v1/questions/'+ question.id +'/downvote')
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.status.should.be.eql(200);
                    res.body.data.should.be.a('array');
                    res.body.data.length.should.be.eql(1);
                    res.body.data[0].should.have.property('meetup');
                    res.body.data[0].should.have.property('title');
                    res.body.data[0].should.have.property('body');
                    res.body.data[0].should.have.property('votes').eql(question.vote - 1);
                    res.body.data[0].should.have.property('id').eql(meetup.id);
                done();
              });


      });
    });

    /*
    * /*
    * POST /meetups/:id/rsvps
    */
    describe('POST /meetups/:id/rsvps', () => {
      it('it should reponse to a meetup rsvp specified by the :id', (done) => {
        const rsvp = {
          id: db.rsvps.length + 1,
          meetup: 1,
          user: 1,
          response: 'yes'
        };
        chai.request(app)
            .post('/meetups/'+rsvp.meetup+'/rsvps')
            .send(rsvp)
            .end((err, res) => {
              res.should.have.status(201);
              res.body.status.should.be.eql(201);
              res.body.data.should.be.a('array');
              res.body.data.length.should.be.eql(1);
              res.body.data[0].should.have.property('meetup');
              res.body.data[0].should.have.property('user');
              res.body.data[0].should.have.property('response');
              res.body.data[0].should.have.property('id').eql(rsvp.id);
              done();
            });

      });
    });
    /*
    * /*
    * DELETE /meetups/:id
    */
    describe('DELETE /api/v1/meetups/:id', () => {
      it('it should delete the meetup specified by the :id', (done) =>{
        const meetup = {
          id: db.meetups.length + 1,
          createdOn: new Date(),
          location: 'KIST',
          topic: 'Intro to Git and GitHub',
          happeningOn: new Date("10/11/2019")
        };
        chai.request(app)
          .delete('/api/v1/meetups/'+meetup.id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.status.should.be.eql(200);
            res.body.data.should.be.a('array');
            res.body.data[0].should.be.a('string');
            done();
          });
      });
    });


});
