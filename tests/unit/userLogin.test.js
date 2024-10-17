const sinon = require('sinon'); // used for stubbing, mocking, and spying for testing purposes
const httpMocks = require('node-mocks-http'); // used for mocking HTTP requests
const bcrypt = require('bcrypt');
const User = require('../../models/user.js'); 
const { postLogin } = require('../../controllers/userController.js'); 

// Imports chai which is used for testing with Mocha in order to test proper cases
let expect; // expect references the Chai package
(async () => {
  const chai = await import('chai');
  expect = chai.expect;
})();

// The following tests ensure that functionality for logging in and registering can be done successfully
describe('Tests login and registration functionality', function () {
  let saveOne, findOne, bcryptStub, req, res, next;

  // Initializes mocks/stubs before each test case is ran
  beforeEach(function () {
    // req/res are mock requests used for simulating requests on a web server
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    saveOne = sinon.stub(User.prototype, 'save'); // stub for saving user to the database
    findOne = sinon.stub(User, 'findOne'); // stub for finding a user in the database
    bcryptStub = sinon.stub(bcrypt, 'compare'); // stub for encrypting passwords with bcrypt
  });

  // restores sinon stubs and mocks to original state after each test case is run
  afterEach(function () {
    sinon.restore();
  });

  // tests that a new user can be saved to the database successfully
  it('Should save a new user to the database', async function () {
    const user = new User({ username: 'user', password: 'password' });

    // defines the needed information for the mock database execution
    saveOne.resolves({ username: 'user', password: 'password' });
    const storedUser = await user.save();

    expect(saveOne.calledOnce).to.be.true;
    expect(storedUser.username).to.equal('user');
    expect(storedUser.password).to.equal('password');
  });

  // tests that a user can successfully log in after registering
  it('should successfully log in a user with correct credentials', async function () {
    const username = 'user';
    const password = 'password';
  
    req.body = { username, password };
    req.session = {}; 
    
    findOne.resolves({ _id: '1', username: username, password: 'password' });
    bcryptStub.resolves(true); // Assume bycrypt was successful and password was encrypted
  
    await postLogin(req, res, next); // test login function with mock request/response
  
    expect(findOne.calledOnceWith({ username })).to.be.true;
    expect(bcryptStub.calledOnceWith(password, 'password')).to.be.true;
    expect(res.statusCode).to.equal(302); //checks for redirect status 
    expect(req.session.userId).to.equal('1'); 
    expect(req.session.username).to.equal(username); 
    expect(req.session.isAuthenticated).to.be.true;
    expect(res._getRedirectUrl()).to.equal('/user/profile'); // verifies proper redirection of user
  });
  
  // Tests a non-existing user and proper redirection and error message
  // No user with 'user' and 'password' is put into a mock database for this test
  it('should return error if user is not found', async function () {
    req.body = { username: 'user', password: 'password' };

    findOne.resolves(null);

    await postLogin(req, res, next);

    expect(findOne.calledOnce).to.be.true;
    expect(res._getRenderView()).to.equal('login'); // Use httpMocks method to check the view rendered
    expect(res._getRenderData().error).to.equal('User not found');
  });

  // test for if a user password is incorrect
  it('should return error if password is incorrect', async function () {
    const username = 'user';
    req.body = { username, password: 'notPassword' };

    findOne.resolves({ _id: '1', username: 'user', password: 'password' });
    bcryptStub.resolves(false);

    await postLogin(req, res, next);

    expect(findOne.calledOnceWith({ username: 'user' })).to.be.true;
    expect(bcryptStub.calledOnce).to.be.true;
    expect(res._getRenderView()).to.equal('login'); // Check the rendered view on error
    expect(res._getRenderData().error).to.equal('Invalid login information');
  });
});
