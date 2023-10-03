const {
  snakeCase,
} = require('../string');

describe('snakeCase()', () => {
  test('changes string to snakeCase', () => {
    expect(snakeCase('withPersonId')).toBe('with_person_id');
    expect(snakeCase('BigBlinkPDX')).toBe('big_blink_pdx');
    expect(snakeCase('Big Blink PDX')).toBe('big_blink_pdx');
  });
});
