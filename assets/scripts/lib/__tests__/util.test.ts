import {
  isEmpty,
} from '../util';

describe('isEmpty()', () => {
  test('returns true if object or array is empty', () => {
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
