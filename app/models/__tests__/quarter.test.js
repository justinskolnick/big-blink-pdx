const Quarter = require('../quarter');

describe('tableName', () => {
  test('returns the expected tableName', () => {
    expect(Quarter.tableName).toBe('quarters');
  });
});

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
  const result = {
    id: 1,
    year: 2014,
    quarter: 2,
    slug: '2014-q2',
  };

  test('adapts a result', () => {
    const quarter = new Quarter(result);

    expect(quarter.adapted).toEqual({
      id: 1,
      year: 2014,
      quarter: 2,
      slug: '2014-q2',
    });
  });
});

describe('setData()', () => {
  test('sets data', () => {
    const quarter = new Quarter({
      id: 1,
      year: 2014,
      quarter: 2,
      slug: '2014-q2',
      x: 'y',
    });

    quarter.setData('z', 'abc');

    expect(quarter.data).toEqual({
      id: 1,
      quarter: 2,
      slug: '2014-q2',
      x: 'y',
      year: 2014,
      z: 'abc',
    });

    expect(quarter.adapted).toEqual({
      id: 1,
      quarter: 2,
      slug: '2014-q2',
      year: 2014,
    });
  });
});
