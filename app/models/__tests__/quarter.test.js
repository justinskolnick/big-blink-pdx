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
      'quarters.date_start',
      'quarters.date_end',
    ]);
  });
});

describe('primaryKey()', () => {
  test('returns the expected field', () => {
    expect(Quarter.primaryKey()).toBe('quarters.id');
  });
});

describe('className()', () => {
  test('returns the expected field', () => {
    expect(Quarter.className()).toBe('Quarter');
  });
});

describe('foreignKey()', () => {
  test('returns the expected field', () => {
    expect(Quarter.foreignKey()).toBe('quarter_id');
  });
});

describe('adapt()', () => {
  /* eslint-disable camelcase */
  const result = {
    date_end: '2014-06-30',
    date_start: '2014-04-01',
    id: 1,
    year: 2014,
    quarter: 2,
    slug: '2014-q2',
  };
  /* eslint-enable camelcase */

  test('adapts a result', () => {
    const quarter = new Quarter(result);

    expect(quarter.adapted).toEqual({
      dateEnd: 'June 30, 2014',
      dateStart: 'April 1, 2014',
      id: 1,
      year: 2014,
      quarter: 2,
      slug: '2014-q2',
    });
  });
});

describe('getData()', () => {
  test('sets data', () => {
    /* eslint-disable camelcase */
    const quarter = new Quarter({
      date_end: '2014-06-30',
      date_start: '2014-04-01',
      id: 1,
      year: 2014,
      quarter: 2,
      slug: '2014-q2',
      x: 'y',
    });
    /* eslint-enable camelcase */

    expect(quarter.getData('date_end')).toEqual('2014-06-30');
    expect(quarter.getData('year')).toEqual(2014);
    expect(quarter.getData('x')).toEqual('y');
  });
});

describe('setData()', () => {
  test('sets data', () => {
    /* eslint-disable camelcase */
    const quarter = new Quarter({
      date_end: '2014-06-30',
      date_start: '2014-04-01',
      id: 1,
      year: 2014,
      quarter: 2,
      slug: '2014-q2',
      x: 'y',
    });

    quarter.setData('z', 'abc');

    expect(quarter.data).toEqual({
      date_end: '2014-06-30',
      date_start: '2014-04-01',
      id: 1,
      quarter: 2,
      slug: '2014-q2',
      x: 'y',
      year: 2014,
      z: 'abc',
    });
    /* eslint-enable camelcase */

    expect(quarter.adapted).toEqual({
      dateEnd: 'June 30, 2014',
      dateStart: 'April 1, 2014',
      id: 1,
      quarter: 2,
      slug: '2014-q2',
      year: 2014,
    });
  });
});

describe('getters', () => {
  let quarter;

  beforeAll(() => {
    /* eslint-disable camelcase */
    quarter = new Quarter({
      date_end: '2014-06-30',
      date_start: '2014-04-01',
      id: 1,
      year: 2014,
      quarter: 2,
      slug: '2014-q2',
    });
    /* eslint-enable camelcase */
  });

  describe('readablePeriod()', () => {
    test('returns the expected value', () => {
      expect(quarter.readablePeriod).toEqual('2014 Q2');
    });
  });

  describe('slug()', () => {
    test('returns the expected value', () => {
      expect(quarter.slug).toEqual('2014-q2');
    });
  });

  describe('year()', () => {
    test('returns the expected value', () => {
      expect(quarter.year).toEqual(2014);
    });
  });
});
