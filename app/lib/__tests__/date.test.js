const {
  getDaysApart,
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
