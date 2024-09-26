const request = require('supertest');
const app = require('../../app');

let expect;
(async () => {
  const chai = await import('chai');
  expect = chai.expect;
})();

describe('App Routes', () => {
  it('should render the home page', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).to.equal(200);
    expect(res.text).to.include('<title>Home Page</title>');
  });
})