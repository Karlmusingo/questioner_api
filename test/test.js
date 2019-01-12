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
    // before((done) => {
    //   db.meetups.forEach(function() {
    //     db.meetups.pop();
    //     done();
    //   });
    // });
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
                  res.body.data.length.should.be.eql(2);
              done();
            });
      });
  });

  /*
    * Test the GET /api/v1/meetups/upcoming/all route
    */
    describe('GET /api/v1/meetups/upcoming/all', () => {
        it('it should GET all upcoming meetups', (done) => {
          chai.request(app)
              .get('/api/v1/meetups/upcoming/all')
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.status.should.be.eql(200);
                    res.body.data.should.be.a('array');
                    res.body.data.length.should.be.eql(1);
                done();
              });
        });
    });

  /*
    * Test the GET /api/v1/meetups/:id route
    */
    describe('GET /api/v1/meetups/:id', () => {
        it('it should return an not found error if the id does not exist', (done) => {
          var meetup = {
            id: db.meetups.length + 1,
            createdOn: new Date(),
            location: 'KIST',
            topic: 'Intro to Git and GitHub',
            happeningOn: new Date("10/11/2019")
          };
          db.meetups.push(meetup);
          chai.request(app)
                .get('/api/v1/meetups/' + (meetup.id + 2))
                .end((err, res) => {
                      res.should.have.status(404);
                      res.body.status.should.be.eql(404);
                      res.body.should.have.property('error');
                  done();
                });
        });
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
                      res.body.data[0].should.have.property('location');
                      res.body.data[0].should.have.property('topic');
                      res.body.data[0].should.have.property('happeningOn');
                      res.body.data.length.should.be.eql(1);
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
      it('it should return an not found error if the id does not exist', (done) => {
        var question = {
          id: db.questions.length + 1,
          createdOn: new Date(),
          title: 'how to join',
          body: 'how to join the andela fellowship',
          votes: 3
        };
        db.meetups.push(question);
        chai.request(app)
              .patch('/api/v1/questions/'+ (question.id + 2) +'/upvote')
              .end((err, res) => {
                    res.should.have.status(404);
                    res.body.status.should.be.eql(404);
                    res.body.should.have.property('error');
                done();
              });
      });

      it('it should increase the vote property for the question specified by :id', (done) => {
        let question = {
          id: db.questions.length + 1,
          createdOn: new Date(),
          meetup: 1,
          title: 'How to do',
          body:'I need to know how to host a api on Heroku',
          votes:2
        };
        db.questions.push(question);
        console.log('question => '+ question.id +' => '+ question.votes);
        chai.request(app)
              .patch('/api/v1/questions/'+ question.id +'/upvote')
              .end((err, res) => {
                    console.log('question => '+ question.id +' => '+ question.votes);
                    res.should.have.status(200);
                    res.body.status.should.be.eql(200);
                    res.body.data.should.be.a('array');
                    res.body.data.length.should.be.eql(1);
                    res.body.data[0].should.have.property('meetup');
                    res.body.data[0].should.have.property('title');
                    res.body.data[0].should.have.property('body');
                    res.body.data[0].should.have.property('votes').eql(question.votes);
                done();
              });


      });
    });

    /*
    * PATCH /api/v1/questions/:id/downvote
    */
    describe('PATCH /api/v1/questions/:id/downvote', () => {
      it('it should return an not found error if the id does not exist', (done) => {
        var question = {
          id: db.questions.length + 1,
          createdOn: new Date(),
          title: 'how to join',
          body: 'how to join the andela fellowship',
          votes: 3
        };
        db.meetups.push(question);
        chai.request(app)
              .patch('/api/v1/questions/'+ (question.id + 2) +'/upvote')
              .end((err, res) => {
                    res.should.have.status(404);
                    res.body.status.should.be.eql(404);
                    res.body.should.have.property('error');
                done();
              });
      });

      it('it should decrease the vote property for the question specified by :id', (done) => {
        const question = {
          id: db.questions.length + 1,
          createdOn: new Date(),
          meetup: 1,
          title: 'How to do',
          body:'I need to know how to host a api on Heroku',
          votes:2
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
                    res.body.data[0].should.have.property('votes').eql(question.votes);
                done();
              });
      });
    });

    /*
    * /*
    * POST /meetups/:id/rsvps
    */
    describe('POST /meetups/:id/rsvps', () => {
      it('it should return a not found error if the id does not exist', (done) => {
        const meetup = {
          id: db.meetups.length + 1,
          createdOn: new Date(),
          location: 'KIST',
          topic: 'Intro to Git and GitHub',
          happeningOn: new Date("10/11/2019")
        };
        db.meetups.push(meetup);
        const rsvp = {
          id: db.rsvps.length + 1,
          meetup: 1,
          user: 1,
          status: 'yes'
        };
        db.rsvps.push(rsvp);
        chai.request(app)
            .post('/api/v1/meetups/'+ (meetup.id + 2) +'/rsvps')
            .send(rsvp)
            .end((err, res) => {
              res.should.have.status(404);
              res.body.status.should.be.eql(404);
              res.body.should.have.property('error');
              done();
            });
      });

      it('it should not post a rsvp without the status and the user properties', (done) => {
        const rsvp = {
          id: db.rsvps.length + 1,
          meetup: 1,
          user: 1,
        };
        db.rsvps.push(rsvp);
        chai.request(app)
            .post('/api/v1/meetups/'+ (rsvp.meetup + 2) +'/rsvps')
            .send(rsvp)
            .end((err, res) => {
              res.should.have.status(400);
              res.body.status.should.be.eql(400);
              res.body.should.have.property('error');
              done();
            });
      });

      it('it should reponse to a meetup rsvp specified by the :id', (done) => {
        const rsvp = {
          id: db.rsvps.length + 1,
          meetup: 1,
          user: 1,
          status: 'yes'
        };
        chai.request(app)
            .post('/api/v1/meetups/'+rsvp.meetup+'/rsvps')
            .send(rsvp)
            .end((err, res) => {
              res.should.have.status(201);
              res.body.status.should.be.eql(201);
              res.body.data.should.be.a('array');
              res.body.data.length.should.be.eql(1);
              res.body.data[0].should.have.property('meetup');
              res.body.data[0].should.have.property('status');
              done();
            });

      });
    });

    /*
    * GET /api/v1/questions/:id'
    */
    describe('GET /api/v1/questions/:id', () => {
      it('it should return a not found error when the meetup id is not found', (done) => {

        chai.request(app)
              .get('/api/v1/questions/' + 20)
              .end((err, res) => {
                    res.should.have.status(404);
                    res.body.status.should.be.eql(404);
                    res.body.should.have.property('error');
                done();
              });
      });

      it('it should get all questions for the specified meetup', (done) => {
        const meetup = {
          id: db.meetups.length + 25,
          createdOn: new Date(),
          location: 'KIST',
          topic: 'Intro to Git and GitHub',
          happeningOn: new Date("10/11/2019")
        };
        db.meetups.push(meetup);
        const question = {
          id: db.questions.length + 1,
          createdOn: new Date(),
          meetup: meetup.id,
          title: 'How to do',
          body:'I need to know how to host a api on Heroku',
          votes:2
        };
        db.questions.push(question);
        chai.request(app)
              .get('/api/v1/questions/' + 1)
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.status.should.be.eql(200);
                    res.body.data.should.be.a('array');
                    // res.body.data.length.should.be.eql(1);
                    res.body.data[0].should.have.property('title');
                    // res.body.data[0].should.have.property('id').eql(question.id);
                done();
              });
      });
    });

    /*
    * DELETE /meetups/:id
    */
    // describe('DELETE /api/v1/meetups/:id', () => {
    //   it('it should delete the meetup specified by the :id', (done) =>{
    //     const meetup = {
    //       id: db.meetups.length + 1,
    //       createdOn: new Date(),
    //       location: 'KIST',
    //       topic: 'Intro to Git and GitHub',
    //       happeningOn: new Date("10/11/2019")
    //     };
    //     chai.request(app)
    //       .delete('/api/v1/meetups/'+meetup.id)
    //       .end((err, res) => {
    //         res.should.have.status(200);
    //         res.body.status.should.be.eql(200);
    //         res.body.data.should.be.a('array');
    //         res.body.data[0].should.be.a('string');
    //         done();
    //       });
    //   });
    // });


});
