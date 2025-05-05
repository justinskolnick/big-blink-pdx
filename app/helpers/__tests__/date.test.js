const {
  formatDateRangeString,
  formatDateString,
} = require('../date');

describe('formatDateString()', () => {
  test('with two dates', () => {
    expect(formatDateRangeString('2014-01-14', '2014-01-16')).toBe('January 14 – 16, 2014');
    expect(formatDateRangeString('2014-01-14', '2014-02-16')).toBe('January 14 – February 16, 2014');
    expect(formatDateRangeString('2014-12-30', '2015-01-02')).toBe('December 30, 2014 – January 2, 2015');
  });
});

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
