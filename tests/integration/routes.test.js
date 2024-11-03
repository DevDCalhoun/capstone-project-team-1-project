const request = require('supertest');
const app = require('../../app');

let expect;
(async () => {
  const chai = await import('chai');
  expect = chai.expect;
})();

// Integration test for home page
describe('App Routes', () => {
  it('should render the home page', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).to.equal(200);
    expect(res.text).to.include('<title>Home Page</title>');
  });
})

// Integration test for about page
describe('App Routes', () => {
  it('should render the about page', async () => {
    const res = await request(app).get('/about');
    expect(res.statusCode).to.equal(200);
    expect(res.text).to.include('<title>About</title>');
  });
})

// Integration test for register page
describe('App Routes', () => {
  it('should render the register page', async () => {
    const res = await request(app).get('/users/register');
    expect(res.statusCode).to.equal(200);
    expect(res.text).to.include('<title>Registration Page</title>');
  });
})

// Integration test for login page
describe('App Routes', () => {
  it('should render the login page', async () => {
    const res = await request(app).get('/user/login');
    expect(res.statusCode).to.equal(200);
    expect(res.text).to.include('<title>Login Page</title>');
  });
})

// Integration test for profile page and 404 page
// profile should fail if there is no session present, as this assumes
describe('App Routes', () => {
  it('should reroute to login page from the profile page with authentication', async () => {
    const res = await request(app).get('/user/profile');
    expect(res.statusCode).to.equal(302);
    expect(res.headers.location).to.equal('/user/login');
  });
})