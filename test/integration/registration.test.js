const request = require('supertest');
const app = require('../../app'); // Path to your Express app
const User = require('../../models/user');

describe('Registration Security Tests', () => {
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
