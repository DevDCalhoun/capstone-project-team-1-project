const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');
const User = require('../../models/user');

describe('Search Feature Integration Testing', () => {

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear the users collection before each test
    await User.deleteMany({});
  
    // Seed the database with test users
    await User.create([
      {
        username: 'Brody',
        email: 'john.doe@example.com',
        password: 'password123',
        isTutor: true,
        major: 'Cybersecurity',
        rating: 4.5,
        schoolYear: 'Senior',
        availability: [
          { day: 'Monday', startTime: '09:00', endTime: '12:00' },
          { day: 'Wednesday', startTime: '13:00', endTime: '15:00' },
        ],
      },
      {
        username: 'John',
        email: 'jane.smith@example.com',
        password: 'password123',
        isTutor: true,
        major: 'Mathematics',
        rating: 4.0,
        schoolYear: 'Junior',
      },
      {
        username: 'Jack',
        email: 'alice.doe@example.com',
        password: 'password123',
        isTutor: false, // Not a tutor
        major: 'Computer Science',
        rating: 3.5,
        schoolYear: 'Sophomore',
      },
    ]);
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('should return tutors only', async () => {
    const response = await request(app)
      .post('/search')
      .send({});

    expect(response.statusCode).toBe(200);

    // Check if non-tutor users are not included
    expect(response.text).toContain('Brody');
    expect(response.text).toContain('John');
    expect(response.text).not.toContain('Jack'); // alice is not a tutor
  });

  it('should filter tutors by username', async () => {
    const response = await request(app)
      .post('/search')
      .send({ username: 'Brody' });

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Brody');
    expect(response.text).not.toContain('John');
  });

  it('should filter tutors by major', async () => {
    const response = await request(app)
      .post('/search')
      .send({ major: 'Cybersecurity' });

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Brody');
    expect(response.text).not.toContain('John');
  });

  it('should filter tutors by available days', async () => {
    const response = await request(app)
      .post('/search')
      .send({ availability: ['Monday'] });

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Brody');
    expect(response.text).not.toContain('John');
  });

  it('should filter tutors by rating', async () => {
    const response = await request(app)
      .post('/search')
      .send({ rating: '4.5' });

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Brody');
    expect(response.text).not.toContain('John');
  });

  it('should return no matching tutors for chosen parameters', async () => {
    const response = await request(app)
      .post('/search')
      .send({ major: 'Physics' });

    expect(response.statusCode).toBe(200);
    expect(response.text).not.toContain('Brody');
    expect(response.text).not.toContain('John');
  });
});
