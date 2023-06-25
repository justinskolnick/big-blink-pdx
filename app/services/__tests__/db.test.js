jest.mock('../../lib/mysql', () => {
  const originalModule = jest.requireActual('../../lib/mysql');

  return {
    __esModule: true,
    ...originalModule,
    execute: async (sql, params) => {
      const results = await Promise.resolve({ sql, params });

      return [results];
    },
  };
});

const {
  get,
  getAll,
} = require('../db');

describe('get()', () => {
  test('with a statement', async () => {
    await expect(get('SELECT id FROM table LIMIT 5')).resolves.toEqual({
      sql: 'SELECT id FROM table LIMIT 5',
      params: [],
    });
  });
});

describe('getAll()', () => {
  test('with a statement', async () => {
    await expect(getAll('SELECT id FROM table LIMIT 5')).resolves.toEqual([
      {
        sql: 'SELECT id FROM table LIMIT 5',
        params: [],
      }
    ]);
  });
});
