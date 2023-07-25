const {
  getDetailDescription,
  getIndexDescription,
} = require('../meta');

describe('getDetailDescription()', () => {
  describe('with a name', () => {
    test('with involving', () => {
      expect(getDetailDescription('John Doe')).toBe('Activity involving John Doe according to lobbying data published by the City of Portland, Oregon');
    });

    test('with another word', () => {
      expect(getDetailDescription('John Doe', 'from')).toBe('Activity from John Doe according to lobbying data published by the City of Portland, Oregon');
    });
  });

  test('without a name', () => {
    expect(getDetailDescription()).toBe('Activity according to lobbying data published by the City of Portland, Oregon');
  });
});

describe('getIndexDescription()', () => {
  test('with a type', () => {
    expect(getIndexDescription('people')).toBe('A list of people involved in lobbying activity according to data published by the City of Portland, Oregon');
  });

  test('without a type', () => {
    expect(getIndexDescription()).toBe('Lobbying activity according to data published by the City of Portland, Oregon');
  });
});
