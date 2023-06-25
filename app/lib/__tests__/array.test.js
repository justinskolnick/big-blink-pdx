const {
  getFirst,
  getLast,
} = require('../array');

describe('getFirst()', () => {
  test('with numbers and string', () => {
    expect(getFirst([])).toBe(undefined);
    expect(getFirst([1, 2, 3])).toBe(1);
    expect(getFirst(['one', 'two', 'three'])).toBe('one');
  });
});

describe('getLast()', () => {
  test('with numbers and string', () => {
    expect(getLast([])).toBe(undefined);
    expect(getLast([1, 2, 3])).toBe(3);
    expect(getLast(['one', 'two', 'three'])).toBe('three');
  });
});
