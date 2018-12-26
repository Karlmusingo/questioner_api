const users = [
  {
    id: 1,
    firstname: 'Karl',
    lastname: 'MUSINGO',
    othername: 'ZIRIMWABAGBO',
    email: 'karlmusingo77@gmail.com',
    phoneNumber:'+243 977 849 995',
    username: 'karlmusingo',
    registered: '22/12/2018',
    isAdmin: true
  }
];
exports.users = users;

const meetups = [
  {
    id: 1,
    createdOn: new Date('10/12/2018'),
    location: 'KIST',
    image: 'img/img.jpg',
    topic: 'ALCinRwanda meetup',
    happeningOn: new Date('22/12/2019'),
    tags: ['tag1', 'tag2', 'tag3']
  }
];
exports.meetups = meetups;

const questions = [
  {
    id: 1,
    createdOn: '22/12/2018',
    createdBy: 1,
    meetup: 1,
    title: 'How to join',
    body: 'we need to know how we can join the andela fellowship',
    votes: 5
  }
];
exports.questions = questions;

const rsvps = [
  {
    id: 1,
    meetup: 1,
    user: 1,
    response: 'no'
  }, {
    id: 2,
    meetup: 1,
    user: 1,
    response: 'yes'
  }
];
exports.rsvps = rsvps;
