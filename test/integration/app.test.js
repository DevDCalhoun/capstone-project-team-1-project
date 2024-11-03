const request = require('supertest');
const app = require('../../app'); // Path to your app.js

describe('App Routes', () => {
  it('should load the home page', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Home'); // Adjust to check content on your home page
  });
  
  it('should return tutors on the search route', async () => {
    const response = await request(app).get('/search');
    expect(response.status).toBe(200);
    // Adjust to match the content you expect on the search page
  });
});