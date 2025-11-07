const Leaderboard = require('../leaderboard');

describe('getLabel()', () => {
  const prefix = 'leaderboard';

  test('returns the expected labels', () => {
    expect(Leaderboard.getLabel('intro', prefix)).toBe('Showing activity');
    expect(Leaderboard.getLabel('title', prefix)).toBe('Leaderboard');
  });
});

describe('getDescription()', () => {
  const values = {
    entitiesTotalResult: 33,
    periodIsValid: true,
    incidentCountResult: 12345,
    lobbyistsTotalResult: 22,
    officialsTotalResult: 5,
    period: '2014–25',
  };

  test('returns the expected string', () => {
    expect(Leaderboard.getDescription(values)).toBe('In 2014–25, 22 lobbyists representing 33 entities reported lobbying 5 City of Portland officials across 12345 incidents.');
  });
});

describe('getValuesForEntities()', () => {
  const items = [
    { id: 4 },
    { id: 5 },
    { id: 6 },
  ];

  test('returns the expected string', () => {
    expect(Leaderboard.getValuesForEntities(items, 123)).toEqual({
      ids: [4, 5, 6],
      labels: {
        links: {
          limit: {
            label: 'View the top 10',
            value: 10,
          },
          more: 'View the full list of entities',
        },
        subtitle: 'Entities are ranked by total number of lobbying incident appearances.',
        table: {
          column: {
            name: 'Name of the entity',
            percentage: 'Share of 123 incidents',
            total: 'Total number of lobbying incidents reported for this entity',
          },
          title: 'Portland’s most active entities',
        },
        title: 'Entities',
      },
    });
  });
});

describe('getValuesForLobbyists()', () => {
  const items = [
    { id: 4 },
    { id: 5 },
    { id: 6 },
  ];

  test('returns the expected string', () => {
    expect(Leaderboard.getValuesForLobbyists(items, 123)).toEqual({
      ids: [4, 5, 6],
      labels: {
        links: {
          limit: {
            label: 'View the top 10',
            value: 10,
          },
          more: 'View all lobbyists in the full list of people',
        },
        subtitle: 'Lobbyists are ranked by total number of lobbying incident appearances.',
        table: {
          column: {
            name: 'Name of the lobbyist',
            percentage: 'Share of 123 incidents',
            total: 'Total number of lobbying incidents reported for this lobbyist',
          },
          title: 'Portland’s most active lobbyists',
        },
        title: 'Lobbyists',
      },
    });
  });
});

describe('getValuesForOfficials()', () => {
  const items = [
    { id: 4 },
    { id: 5 },
    { id: 6 },
  ];

  test('returns the expected string', () => {
    expect(Leaderboard.getValuesForOfficials(items, 123)).toEqual({
      ids: [4, 5, 6],
      labels: {
        links: {
          limit: {
            label: 'View the top 10',
            value: 10,
          },
          more: 'View all officials in the full list of people',
        },
        subtitle: 'Portland City officials are ranked by total number of lobbying incident appearances.',
        table: {
          column: {
            name: 'Name of the official',
            percentage: 'Share of 123 incidents',
            total: 'Total number of lobbying incidents reported for this official',
          },
          title: 'Portland’s most lobbied officials',
        },
        title: 'City Officials',
      },
    });
  });
});
