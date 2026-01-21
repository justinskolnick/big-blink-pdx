import {
  isEmpty,
  isObject,
} from '../util';

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

describe('isObject()', () => {
  test('returns true if item is an object', () => {
    expect(isObject(null)).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject([1, 2, 3, 3])).toBe(false);
    expect(isObject([1])).toBe(false);
    expect(isObject([])).toBe(false);
    expect(isObject({ one: 1, two: 2, })).toBe(true);
    expect(isObject({ one: 1 })).toBe(true);
    expect(isObject({})).toBe(true);
    expect(isObject('nice')).toBe(false);
    expect(isObject('')).toBe(false);
    expect(isObject(() => {})).toBe(false);
  });
});
