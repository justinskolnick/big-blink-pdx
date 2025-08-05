const {
  isEmpty,
  isFalsy,
  isTruthy,
} = require('../util');

describe('isEmpty()', () => {
  test('returns true if object or array is empty', () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
    expect(isEmpty([1, 2, 3, 3])).toBe(false);
    expect(isEmpty([1])).toBe(false);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty({ one: 1, two: 2, })).toBe(false);
    expect(isEmpty({ one: 1 })).toBe(false);
    expect(isEmpty({})).toBe(true);
    expect(isEmpty('nice')).toBe(false);
    expect(isEmpty('')).toBe(true);
    expect(isEmpty(() => {})).toBe(null);
  });
});

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
