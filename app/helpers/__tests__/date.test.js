const {
  formatDateString,
} = require('../date');

describe('formatDateString()', () => {
  test('with a date', () => {
    expect(formatDateString('2014-01-14')).toBe('January 14, 2014');
  });

  test('with a date and time', () => {
    expect(formatDateString('2014-01-14 20:16:54')).toBe('January 14, 2014');
  });

  test('with a date and time and timezone', () => {
    expect(formatDateString('2014-01-14 20:16:54', true)).toBe('January 14, 2014');
  });
});
