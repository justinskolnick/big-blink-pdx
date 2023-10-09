const {
  snakeCase,
  toSentence,
} = require('../string');

describe('snakeCase()', () => {
  test('changes string to snakeCase', () => {
    expect(snakeCase('withPersonId')).toBe('with_person_id');
    expect(snakeCase('BigBlinkPDX')).toBe('big_blink_pdx');
    expect(snakeCase('Big Blink PDX')).toBe('big_blink_pdx');
  });
});

describe('toSentence()', () => {
  const locale = 'en';

  test('should return the array as a comma-delimited list.', () => {
    expect(toSentence(['x'], locale)).toEqual('x');
    expect(toSentence(['x', 'y'], locale)).toEqual('x and y');
    expect(toSentence(['x', 'y', 'z'], locale)).toEqual('x, y, and z');
    expect(toSentence(['x', 'y', 'z'], locale, false)).toEqual('x, y, or z');
  });
});
