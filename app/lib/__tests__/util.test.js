const {
  isFalsy,
  isTruthy,
} = require('../util');

describe('isFalsy()', () => {
  test('evaluates falsiness', () => {
    expect(isFalsy('item')).toBe(false);
    expect(isFalsy('')).toBe(true);

    expect(isFalsy('0')).toBe(true);
    expect(isFalsy(0)).toBe(true);
    expect(isFalsy('false')).toBe(true);
    expect(isFalsy(false)).toBe(true);

    expect(isFalsy('1')).toBe(false);
    expect(isFalsy(1)).toBe(false);
    expect(isFalsy('true')).toBe(false);
    expect(isFalsy(true)).toBe(false);
  });
});

describe('isTruthy()', () => {
  test('evaluates truthiness', () => {
    expect(isTruthy('item')).toBe(true);
    expect(isTruthy('')).toBe(false);

    expect(isTruthy('0')).toBe(false);
    expect(isTruthy(0)).toBe(false);
    expect(isTruthy('false')).toBe(false);
    expect(isTruthy(false)).toBe(false);

    expect(isTruthy('1')).toBe(true);
    expect(isTruthy(1)).toBe(true);
    expect(isTruthy('true')).toBe(true);
    expect(isTruthy(true)).toBe(true);
  });
});
