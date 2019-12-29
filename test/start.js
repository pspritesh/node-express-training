const { expect } = require('chai');

it('Should add numbers correctly.', () => {
  const num1 = 2, num2 = 3;
  expect(num1 + num2).to.equal(5);
});

it('Should not return 6.', () => {
  const num1 = 2, num2 = 3;
  expect(num1 + num2).not.to.equal(6);
});