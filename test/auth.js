const { expect } = require('chai')
const app = require('../app')
const request = require('supertest')

const authenticatedUser = request.agent(app);
before(done => {
  authenticatedUser
    .post('/login')
    .send({
      "username": "PSPMongo",
      "password": "PSP@penta"
    })
    .end((err, response) => {
      expect(response.statusCode).to.equal(200);
      expect('Location', '/home');
      done();
    });
});
