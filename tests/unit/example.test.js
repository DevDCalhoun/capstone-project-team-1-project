const app = require('../../app');
const { add } = require('./test');

let expect;
(async () => {
  const chai = await import('chai');
  expect = chai.expect;
})();

describe('Utils Test', function () {
  it('should return the sum of two numbers', function () {
    const result = add(2, 3);
    expect(result).to.equal(5);
  })
})