const {
  getInvalidValueMessage,
  getQuarterSlug,
  getSort,
  getSortBy,
  hasQuarterAndYear,
  hasSort,
  hasSortBy,
} = require('../param');

describe('getInvalidValueMessage()', () => {
  test('with a param value', () => {
    expect(getInvalidValueMessage('name', 123)).toEqual('<strong>123</strong> is not a valid value for <code>name</code>');
  });
});

describe('getQuarterSlug()', () => {
  test('with a param value', () => {
    expect(getQuarterSlug('Q4-2021')).toEqual('2021-q4');
    expect(getQuarterSlug('2021-Q4')).toEqual('2021-q4');
  });
});

describe('getSort()', () => {
  test('with a param value', () => {
    expect(getSort('ASC')).toEqual('ASC');
    expect(getSort('DESC')).toEqual('DESC');
    expect(getSort('RISC')).toBeNull();
  });
});

describe('getSortBy()', () => {
  test('with a param value', () => {
    expect(getSortBy('name')).toEqual('name');
    expect(getSortBy('total')).toEqual('total');
    expect(getSortBy('id')).toBeNull();
  });
});

describe('hasQuarterAndYear()', () => {
  test('with a param value', () => {
    expect(hasQuarterAndYear('Q4-2021')).toBe(true);
  });
});

describe('hasSort()', () => {
  test('with a param value', () => {
    expect(hasSort('ASC')).toBe(true);
    expect(hasSort('DESC')).toBe(true);
    expect(hasSort('RISC')).toBe(false);
  });
});

describe('hasSortBy()', () => {
  test('with a param value', () => {
    expect(hasSortBy('name')).toBe(true);
    expect(hasSortBy('total')).toBe(true);
    expect(hasSortBy('id')).toBe(false);
  });
});
