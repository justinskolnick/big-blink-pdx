const {
  percentage,
  toNumeral,
  toOrdinal,
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

describe('toOrdinal()', () => {
  test('returns the expected values', () => {
    expect(toOrdinal(1)).toEqual('first');
    expect(toOrdinal(2)).toEqual('second');
    expect(toOrdinal(10)).toEqual('tenth');
    expect(toOrdinal(12)).toEqual('twelveth');
    expect(toOrdinal(13)).toEqual('13th');
    expect(toOrdinal(21)).toEqual('21st');
    expect(toOrdinal(123)).toEqual('123rd');
  });
});
