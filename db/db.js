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
export default users;

const meetups = [
  {
    id: 1,
    createdOn: '22/12/2018',
    location: 'KIST',
    image: 'img/img.jpg',
    topic: 'ALCinRwanda meetup',
    happeningOn: '22/12/2018',
    tags: ['tag1', 'tag2', 'tag3']
  }
];
export default meetups;

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
export default questions;

const rsvp = [
  {
    id: 1,
    meetup: 1,
    user: 1,
    response: 'no'
  }
];
export default rsvp;
