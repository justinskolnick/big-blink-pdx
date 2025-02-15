const Quarter = require('../quarter');

describe('fields()', () => {
  test('returns the expected fields', () => {
    expect(Quarter.fields()).toEqual([
      'quarters.id',
      'quarters.year',
      'quarters.quarter',
      'quarters.slug',
    ]);
  });
});

describe('adapt()', () => {
  test('adapts a result', () => {
    expect(Quarter.adapt({
      id: 1,
      year: 2014,
      quarter: 2,
      slug: '2014-q2',
    })).toEqual({
      id: 1,
      year: 2014,
      quarter: 2,
      slug: '2014-q2',
    });
  });

  test('sets data', () => {
    const quarter = new Quarter({
      x: 'y',
    });

    quarter.setData('z', 'abc');

    expect(quarter.data).toEqual({
      x: 'y',
      z: 'abc',
    });

    expect(quarter.adapted).toEqual({
      id: undefined,
      quarter: undefined,
      slug: undefined,
      year: undefined,
    });
  });
});
