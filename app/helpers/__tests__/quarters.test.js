const {
  getRangesByYear,
  getRangesByYearSet,
  getRangeStatement,
} = require('../quarters');

const example = [
  { quarter: 2, year: 2019, },
  { quarter: 3, year: 2019, },
  { quarter: 4, year: 2019, },
  { quarter: 1, year: 2020, },
  { quarter: 2, year: 2020, },
  { quarter: 3, year: 2020, },
  { quarter: 4, year: 2020, },
  { quarter: 1, year: 2021, },
  // { quarter: 2, year: 2021, },
  { quarter: 3, year: 2021, },
  // { quarter: 4, year: 2021, },
  { quarter: 1, year: 2022, },
  { quarter: 2, year: 2022, },
  { quarter: 1, year: 2023, },
  { quarter: 2, year: 2023, },
  { quarter: 3, year: 2023, },
  { quarter: 4, year: 2023, },
  { quarter: 1, year: 2024, },
  { quarter: 2, year: 2024, },
  { quarter: 3, year: 2024, },
  { quarter: 4, year: 2024, },
  { quarter: 2, year: 2025, },
];

describe('getRangesByYear()', () => {
  test('returns an array of ranges', () => {
    expect(getRangesByYear(example)).toEqual([
      null,
      { year: 2019, quarter: 2 },
      { year: 2019, quarter: 3 },
      { year: 2019, quarter: 4 },
      { year: 2020, quarter: 1 },
      { year: 2020, quarter: 2 },
      { year: 2020, quarter: 3 },
      { year: 2020, quarter: 4 },
      { year: 2021, quarter: 1 },
      null,
      { year: 2021, quarter: 3 },
      null,
      { year: 2022, quarter: 1 },
      { year: 2022, quarter: 2 },
      null,
      { year: 2023, quarter: 1 },
      { year: 2023, quarter: 2 },
      { year: 2023, quarter: 3 },
      { year: 2023, quarter: 4 },
      { year: 2024, quarter: 1 },
      { year: 2024, quarter: 2 },
      { year: 2024, quarter: 3 },
      { year: 2024, quarter: 4 },
      null,
      { year: 2025, quarter: 2 },
      null,
    ]);
  });
});

describe('getRangesByYear()', () => {
  test('returns an array of ranges', () => {
    expect(getRangesByYearSet(example)).toEqual([
      [ { year: 2019, quarter: 2 }, { year: 2021, quarter: 1 } ],
      [ { year: 2021, quarter: 3 } ],
      [ { year: 2022, quarter: 1 }, { year: 2022, quarter: 2 } ],
      [ { year: 2023, quarter: 1 }, { year: 2024, quarter: 4 } ],
      [ { year: 2025, quarter: 2 } ],
    ]);
  });
});

describe('getRangeStatement()', () => {
  test('returns a statement describing the ranges', () => {
    const sets = getRangesByYearSet(example);

    expect(getRangeStatement(sets)).toEqual('2019\xa0Q2\xa0–\xa02021\xa0Q1, 2021\xa0Q3, 2022\xa0Q1–2, 2023\xa0Q1\xa0–\xa02024\xa0Q4, and 2025\xa0Q2');
  });
});
