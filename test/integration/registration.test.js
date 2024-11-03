const request = require('supertest');
const app = require('../../app'); // Path to your Express app
const User = require('../../models/user');

jest.mock('../../models/user.js');

describe('Registration Input Validation Tests', () => {
  beforeEach(async () => {
    await User.deleteMany({}); // Clean up user collection before each test
  });

  it('should reject empty username', async () => {
    const res = await request(app)
      .post('/users/register')
      .send({
        username: '',
        email: 'test@example.com',
        password: 'Password1!',
      });
    expect(res.status).toBe(400);
    expect(res.text).toContain('Username is required');
  });

  it('should reject invalid email format', async () => {
    const res = await request(app)
      .post('/users/register')
      .send({
        username: 'testuser',
        email: 'invalid-email',
        password: 'Password1!',
      });
    expect(res.status).toBe(400);
    expect(res.text).toContain('Enter a valid email');
  });

  it('should reject weak passwords', async () => {
    const res = await request(app)
      .post('/users/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'weak', // Does not meet password criteria
      });
    expect(res.status).toBe(400);
    expect(res.text).toContain('Password must be 8-12 characters');
  });
});

describe('POST /users/register', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should register a new user with valid data', async () => {
      User.findOne.mockResolvedValue(null);
  
      User.prototype.save = jest.fn().mockResolvedValue();
  
      const res = await request(app)
        .post('/users/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'Password123!',
          major: 'Computer Engineering',
          schoolYear: 'Junior',
          isTutor: true,
        });
  
        expect(res.status).toBe(302); // Expect a redirect status code
        expect(res.header.location).toBe('/user/profile'); // Check the redirect location if applicable
    });
  
    it('should not register a user with missing or invalid data', async () => {
      const res = await request(app)
        .post('/users/register')
        .send({
          username: '', 
          email: 'invalidemail', 
          password: '123', 
          major: 'Computer Engineering',
          schoolYear: 'InvalidYear',
          isTutor: 'notaboolean', 
        });
  
      expect(res.status).toBe(400);
      expect(res.text).toContain('Username is required');
      expect(res.text).toContain('Enter a valid email');
      expect(res.text).toContain('Password must be 8-12 characters');
      expect(res.text).toContain('Password must contain at least one lowercase letter');
      expect(res.text).toContain('Password must contain at least one uppercase letter');
      expect(res.text).toContain('Password must contain at least one special character');
      expect(res.text).toContain('Select a valid school year');
      expect(res.text).toContain('Invalid tutor selection');
    });
  
    afterAll((done) => {
      // Close the server or any resources used
      if (app.close) app.close(); // Close if `app` is an HTTP server instance
      done();
    });
  });
