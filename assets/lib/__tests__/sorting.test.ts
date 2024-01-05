import {
  sortQuarterAscendingTypeDecending,
} from '../sorting';

const items = [
  { quarter: 1, type: 'activity' },
  { quarter: 2, type: 'activity' },
  { quarter: 1, type: 'registration' },
  { quarter: 2, type: 'registration' },
];

describe('sortQuarterAscendingTypeDecending()', () => {
  test('sorts by quarter and type', () => {
    expect(items.sort(sortQuarterAscendingTypeDecending)).toEqual([
      { quarter: 1, type: 'registration' },
      { quarter: 1, type: 'activity' },
      { quarter: 2, type: 'registration' },
      { quarter: 2, type: 'activity' },
    ]);
  });
});
