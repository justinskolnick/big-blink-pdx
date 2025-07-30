const {
  getFirst,
  getLast,
  unique,
  uniqueObjects,
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

describe('unique()', () => {
  test('with numbers and string', () => {
    expect(unique([])).toEqual([]);
    expect(unique([1, 2, 3])).toEqual([1, 2, 3]);
    expect(unique([1, 2, 3, 3])).toEqual([1, 2, 3]);
    expect(unique(['one', 'two', 'three'])).toEqual(['one', 'two', 'three']);
    expect(unique(['one', 'two', 'one', 'three', 'three'])).toEqual(['one', 'two', 'three']);
  });
});

describe('uniqueObjects()', () => {
  const obj1 = {
    id: 1,
    name: 'John Doe',
    isActive: false,
  };
  const obj2 = {
    id: 1,
    name: 'John Doe',
    isActive: false,
  };
  const obj3 = {
    id: 2,
    name: 'Jane Doe',
    isActive: true,
  };

  test('with objects', () => {
    expect(uniqueObjects([obj1, obj2, obj3])).toEqual([obj1, obj3]);
  });
});
