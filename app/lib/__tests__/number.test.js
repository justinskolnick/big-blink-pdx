const {
  percentage,
  toNumeral,
} = require('../number');

describe('percentage()', () => {
  test('calculates percentage of total', () => {
    expect(percentage(1, 2)).toBe('50.00');
  });
});

describe('toNumeral()', () => {
  test('returns the expected values', () => {
    expect(toNumeral(1)).toEqual('one');
    expect(toNumeral(2)).toEqual('two');
    expect(toNumeral(10)).toEqual('ten');
    expect(toNumeral(12)).toEqual('twelve');
    expect(toNumeral(13)).toEqual(13);
    expect(toNumeral(21)).toEqual(21);
    expect(toNumeral(123)).toEqual(123);
  });
});
