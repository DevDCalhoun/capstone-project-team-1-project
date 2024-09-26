const request = require('supertest');
const app = require('../../app');

let expect;
(async () => {
  const chai = await import('chai');
  expect = chai.expect;
})();

before(async function () {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27017/disruptutorDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }
});

describe('App Routes', () => {
this.timeout(10000);

  it('should render the home page', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).to.equal(200);
    expect(res.text).to.include('<title>Home Page</title>');
  });
})

after(async function () {
  await mongoose.disconnect();
});