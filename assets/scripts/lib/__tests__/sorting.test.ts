// todo: mocks

import {
  sortQuarterAscendingTypeDecending,
} from '../sorting';

import type { Source } from '../../types';
import { DataFormat } from '../../types';

const csv = DataFormat['csv'];
const excel = DataFormat['excel'];

const retrievedDate = 'July 23, 2025';
const labels = {
  disclaimer: 'disclaimer',
};

const item1 = { id: 1, title: 'Source 1', year: 2025, quarter: 1, type: 'activity', format: csv, isViaPublicRecords: false, retrievedDate, labels, } as Source;
const item2 = { id: 2, title: 'Source 2', year: 2025, quarter: 2, type: 'activity', format: csv, isViaPublicRecords: false, retrievedDate, labels, } as Source;
const item3 = { id: 3, title: 'Source 3', year: 2025, quarter: 1, type: 'registration', format: csv, isViaPublicRecords: false, retrievedDate, labels, } as Source;
const item4 = { id: 4, title: 'Source 4', year: 2025, quarter: 2, type: 'registration', format: csv, isViaPublicRecords: false, retrievedDate, labels, } as Source;
const item5 = { id: 5, title: 'Source 5', year: 2025, quarter: null, type: 'personnel', format: excel, isViaPublicRecords: true, retrievedDate, labels, } as Source;

const items = [
  item1,
  item2,
  item3,
  item4,
  item5,
];

describe('sortQuarterAscendingTypeDecending()', () => {
  test('sorts by quarter and type', () => {
    expect(items.sort(sortQuarterAscendingTypeDecending)).toEqual([
      item1,
      item3,
      item2,
      item4,
      item5,
    ]);
  });
});
