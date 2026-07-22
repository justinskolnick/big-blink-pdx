const resultCityCommissioner = require('../__mocks__/city-office/result-city-commissioner-2.json');
const resultCityCouncilor = require('../__mocks__/city-office/result-city-councilor.json');
const resultMayor = require('../__mocks__/city-office/result-mayor.json');

const CityOffice = require('../city-office');

describe('className()', () => {
  test('returns the expected field', () => {
    expect(CityOffice.className()).toBe('CityOffice');
  });
});

describe('with a mayor', () => {
  const cityOffice = new CityOffice(resultMayor);

  describe('isCityCommissioner()', () => {
    test('returns the expected value', () => {
      expect(cityOffice.isCityCommissioner()).toBe(false);
    });
  });

  describe('isElected()', () => {
    test('returns the expected value', () => {
      expect(cityOffice.isElected()).toBe(true);
    });
  });

  describe('isCurrent()', () => {
    test('returns the expected value', () => {
      expect(cityOffice.isCurrent()).toBe(true);
    });
  });

  describe('adapt()', () => {
    test('returns the expected object', () => {
      expect(cityOffice.adapted).toEqual({
        district: null,
        id: 1,
        isElected: true,
        office: 'Mayor',
        position: null,
      });
    });
  });
});

describe('with a city commissioner', () => {
  const cityOffice = new CityOffice(resultCityCommissioner);

  describe('isCityCommissioner()', () => {
    test('returns the expected value', () => {
      expect(cityOffice.isCityCommissioner()).toBe(true);
    });
  });

  describe('isElected()', () => {
    test('returns the expected value', () => {
      expect(cityOffice.isElected()).toBe(true);
    });
  });

  describe('isCurrent()', () => {
    test('returns the expected value', () => {
      expect(cityOffice.isCurrent()).toBe(false);
    });
  });

  describe('adapt()', () => {
    test('returns the expected object', () => {
      expect(cityOffice.adapted).toEqual({
        district: null,
        id: 4,
        isElected: true,
        office: 'City Commissioner',
        position: 2,
      });
    });
  });
});

describe('with a city councilor', () => {
  const cityOffice = new CityOffice(resultCityCouncilor);

  describe('isCityCommissioner()', () => {
    test('returns the expected value', () => {
      expect(cityOffice.isCityCommissioner()).toBe(false);
    });
  });

  describe('isElected()', () => {
    test('returns the expected value', () => {
      expect(cityOffice.isElected()).toBe(true);
    });
  });

  describe('isCurrent()', () => {
    test('returns the expected value', () => {
      expect(cityOffice.isCurrent()).toBe(true);
    });
  });

  describe('adapt()', () => {
    test('returns the expected object', () => {
      expect(cityOffice.adapted).toEqual({
        district: 2,
        id: 12,
        isElected: true,
        office: 'City Councilor',
        position: 3,
      });
    });
  });
});
