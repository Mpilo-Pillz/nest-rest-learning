/*
 * this is a pure function
 * pure functions are funcs ith no side effect
 * this means that the same input always gives te same output
 * easiest funcs to test
 */

function addNumbers(num1, num2) {
  return num1 + num2;
}

describe('addNumbers', () => {
  it('adds two numbers', () => {
    expect(addNumbers(10, 10)).toEqual(20);
  });
});
