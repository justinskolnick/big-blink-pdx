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
  { quarter: 2, year: 2021, },
  { quarter: 3, year: 2021, },
  { quarter: 4, year: 2021, },
  { quarter: 1, year: 2022, },
  { quarter: 3, year: 2022, },
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
      { year: 2021, quarter: 2 },
      { year: 2021, quarter: 3 },
      { year: 2021, quarter: 4 },
      { year: 2022, quarter: 1 },
      null,
      { year: 2022, quarter: 3 },
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
      [ { year: 2019, quarter: 2 }, { year: 2022, quarter: 1 } ],
      [ { year: 2022, quarter: 3 } ],
      [ { year: 2023, quarter: 1 }, { year: 2024, quarter: 4 } ],
      [ { year: 2025, quarter: 2 } ],
    ]);
  });
});

describe('getRangeStatement()', () => {
  test('returns a statement describing the ranges', () => {
    const sets = getRangesByYearSet(example);

    expect(getRangeStatement(sets)).toEqual('Q2 2019 – Q1 2022, Q3 2022, Q1 2023 – Q4 2024, Q2 2025');
  });
});
