import {
  unique,
} from '../array';

describe('unique()', () => {
  test('returns unique values', () => {
    expect(unique([1, 2, 3, 3])).toEqual([1, 2, 3]);
    expect(unique(['zip', 'zip', 'zip'])).toEqual(['zip']);
    expect(unique('fa la la la lah'.split(' '))).toEqual(['fa', 'la', 'lah']);
  });
});
