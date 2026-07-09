const {
  getDaysApart,
  getMonthsToYears,
  getYearsToMonths,
} = require('../date');

describe('getDaysApart()', () => {
  test('returns the expected values', () => {
    expect(getDaysApart('2026-07-07', '2026-07-07')).toEqual(0);
    expect(getDaysApart('2026-07-07', '2026-07-06')).toEqual(1);
    expect(getDaysApart('2026-07-07', '2026-07-05')).toEqual(2);
    expect(getDaysApart('2026-07-07', '2026-06-07')).toEqual(30);
    expect(getDaysApart('2026-07-07', '2025-07-07')).toEqual(365);
    expect(getDaysApart('2025-07-07', '2026-07-07')).toEqual(365);
  });
});

describe('getMonthsToYears()', () => {
  test('returns the expected values', () => {
    expect(getMonthsToYears(1)).toEqual(0);
    expect(getMonthsToYears(6)).toEqual(1);
    expect(getMonthsToYears(12)).toEqual(1);
    expect(getMonthsToYears(15)).toEqual(1);
    expect(getMonthsToYears(24)).toEqual(2);
    expect(getMonthsToYears(26)).toEqual(2);

    expect(getMonthsToYears(1, false)).toEqual([0, 1]);
    expect(getMonthsToYears(6, false)).toEqual([0, 6]);
    expect(getMonthsToYears(12, false)).toEqual([1, 0]);
    expect(getMonthsToYears(15, false)).toEqual([1, 3]);
    expect(getMonthsToYears(24, false)).toEqual([2, 0]);
    expect(getMonthsToYears(26, false)).toEqual([2, 2]);
  });
});

describe('getYearsToMonths()', () => {
  test('returns the expected values', () => {
    expect(getYearsToMonths(1)).toEqual(12);
    expect(getYearsToMonths(2)).toEqual(24);
    expect(getYearsToMonths(4)).toEqual(48);
    expect(getYearsToMonths(8)).toEqual(96);
  });
});
