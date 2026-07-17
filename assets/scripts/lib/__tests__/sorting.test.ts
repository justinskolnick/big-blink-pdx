// todo: mocks

import {
  sortSourceDateAscendingTypeDecending,
} from '../sorting';

import {
  DataFormat,
  type SourceObject,
  type SourceType,
} from '../../types';

const csv = DataFormat['csv'];
const excel = DataFormat['excel'];

const retrievedDate = 'July 23, 2025';
const getActivityItem = (id: number, year: number, quarter?: number) => ({
  id,
  title: `Source ${id}`,
  year,
  quarter,
  type: 'activity' as SourceType,
  format: csv,
  isViaPublicRecords: false,
  retrievedDate,
  labels: {
    disclaimer: 'disclaimer',
    overview: {
      chart: `Source ${id}`,
      title: `Source ${id}`,
    },
    incidents: {
      title: `Source ${id}`,
    },
  },
});
const getRegistrationItem = (id: number, year: number, quarter?: number) => ({
  id,
  title: `Source ${id}`,
  year,
  quarter,
  type: 'registration' as SourceType,
  format: csv,
  isViaPublicRecords: false,
  retrievedDate,
  labels: {
    disclaimer: 'disclaimer',
    overview: {
      chart: `Source ${id}`,
      title: `Source ${id}`,
    },
  },
});
const getPersonnelItem = (id: number, year: number, quarter?: number) => ({
  id,
  title: `Source ${id}`,
  year,
  quarter,
  type: 'personnel' as SourceType,
  format: excel,
  isViaPublicRecords: true,
  retrievedDate,
  labels: {
    disclaimer: 'disclaimer',
    overview: {
      chart: `Source ${id}`,
      title: `Source ${id}`,
    },
  },
});

const item1: SourceObject = getActivityItem(1, 2025, 1);
const item2: SourceObject = getActivityItem(2, 2025, 2);
const item3: SourceObject = getActivityItem(3, 2025, 1);
const item4: SourceObject = getRegistrationItem(4, 2025, 2);
const item5: SourceObject = getPersonnelItem(5, 2025, undefined);

const items = [
  item1,
  item2,
  item3,
  item4,
  item5,
];

describe('sortSourceDateAscendingTypeDecending()', () => {
  test('sorts by quarter and type', () => {
    expect(items.sort(sortSourceDateAscendingTypeDecending)).toEqual([
      item1,
      item3,
      item2,
      item4,
      item5,
    ]);
  });
});
