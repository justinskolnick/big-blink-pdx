const {
  percentage,
} = require('../number');

describe('percentageOfTotal()', () => {
  test('calculates percentage of total', () => {
    expect(percentage(1, 2)).toBe('50.00');
  });
});
