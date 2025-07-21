const {
  capitalize,
  snakeCase,
  titleCase,
  toSentence,
} = require('../string');

describe('capitalize()', () => {
  test('changes string to capitalize', () => {
    expect(capitalize('people')).toBe('People');
    expect(capitalize('People')).toBe('People');
    expect(capitalize('BigBlinkPDX')).toBe('BigBlinkPDX');
    expect(capitalize('Big Blink PDX')).toBe('Big Blink PDX');
  });
});

describe('snakeCase()', () => {
  test('changes string to snakeCase', () => {
    expect(snakeCase('withPersonId')).toBe('with_person_id');
    expect(snakeCase('BigBlinkPDX')).toBe('big_blink_pdx');
    expect(snakeCase('Big Blink PDX')).toBe('big_blink_pdx');
  });
});

describe('titleCase()', () => {
  test('changes string to titleCase', () => {
    expect(titleCase('one two three')).toBe('One Two Three');
    expect(titleCase('Big Blink PDX')).toBe('Big Blink PDX');
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
