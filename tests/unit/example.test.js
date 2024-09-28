const sinon = require('sinon');
const User = require('../../models/user'); // Adjust path to your User model


let expect;
(async () => {
  const chai = await import('chai');
  expect = chai.expect;
})();

describe('Reads/writes to database using sinon mocking', function () {
  let saveUser, findUser; // mocks the save and findOne functions from MongoDB

  // New mock stubs are made for save and find after each test function
  this.beforeEach(function () {
    saveUser = sinon.stub(User.prototype, 'save');
    findUser = sinon.stub(User, 'findOne');
  });

  // stubs are restored to default after each test function
  this.afterEach(function () {
    sinon.restore();
  });

  // Tests that a new user can be saved to the database
  it('Should save a new user to the database', async function () {
    saveUser.resolves({username: 'user', password: 'password'});

    const user = new User({ username: 'user', password: 'password'});
    const storedUser = await user.save();

    expect(saveUser.calledOnce).to.be.true;
    expect(storedUser.username).to.equal('user');
    expect(storedUser.password).to.equal('password');
  })
})