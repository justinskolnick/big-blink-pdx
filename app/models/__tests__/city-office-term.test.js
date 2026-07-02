const resultCityOfficeCityCommissioner = require('../__mocks__/city-office/result-city-commissioner.json');
const resultCityOfficeCityCouncilor = require('../__mocks__/city-office/result-city-councilor.json');
const resultCityOfficeMayor = require('../__mocks__/city-office/result-mayor.json');
const resultCityCommissioner = require('../__mocks__/city-office-term/result-city-commissioner.json');
const resultCityCouncilor = require('../__mocks__/city-office-term/result-city-councilor.json');
const resultMayor = require('../__mocks__/city-office-term/result-mayor.json');

const CityOffice = require('../city-office');
const CityOfficeTerm = require('../city-office-term');

describe('className()', () => {
  test('returns the expected field', () => {
    expect(CityOfficeTerm.className()).toBe('CityOfficeTerm');
  });
});

describe('with a mayor', () => {
  const cityOffice = new CityOffice(resultCityOfficeMayor);
  const cityOfficeTerm = new CityOfficeTerm(resultMayor);

  cityOfficeTerm.setCityOffice(cityOffice);

  describe('adapt()', () => {
    test('returns the expected object', () => {
      expect(cityOfficeTerm.adapted).toEqual({
        dateEnd: 'December 31, 2028',
        dateStart: 'January 1, 2025',
        durationNumber: 4,
        durationUnit: 'year',
        id: 1,
        office: {
          district: null,
          id: 1,
          isElected: true,
          office: 'Mayor',
          position: null,
        },
        raw: {
          dateEnd: '2028-12-31',
          dateStart: '2025-01-01',
        },
      });
    });
  });

  describe('duration()', () => {
    test('returns the expected value', () => {
      expect(cityOfficeTerm.duration).toEqual('four-year');
    });
  });

  describe('isCurrent()', () => {
    test('returns the expected value', () => {
      expect(cityOfficeTerm.isCurrent()).toBe(true);
    });
  });
});

describe('with a city commissioner', () => {
  const cityOffice = new CityOffice(resultCityOfficeCityCommissioner);
  const cityOfficeTerm = new CityOfficeTerm(resultCityCommissioner);

  cityOfficeTerm.setCityOffice(cityOffice);

  describe('adapt()', () => {
    test('returns the expected object', () => {
      expect(cityOfficeTerm.adapted).toEqual({
        dateEnd: 'December 31, 2024',
        dateStart: 'January 1, 2021',
        durationNumber: 4,
        durationUnit: 'year',
        id: 19,
        office: {
          district: null,
          id: 6,
          isElected: true,
          office: 'City Commissioner',
          position: 4,
        },
        raw: {
          dateEnd: '2024-12-31',
          dateStart: '2021-01-01',
        },
      });
    });
  });

  describe('duration()', () => {
    test('returns the expected value', () => {
      expect(cityOfficeTerm.duration).toEqual('four-year');
    });
  });

  describe('isCurrent()', () => {
    test('returns the expected value', () => {
      expect(cityOfficeTerm.isCurrent()).toBe(false);
    });
  });
});

describe('with a city councilor', () => {
  const cityOffice = new CityOffice(resultCityOfficeCityCouncilor);
  const cityOfficeTerm = new CityOfficeTerm(resultCityCouncilor);

  cityOfficeTerm.setCityOffice(cityOffice);

  describe('adapt()', () => {
    test('returns the expected object', () => {
      expect(cityOfficeTerm.adapted).toEqual({
        dateEnd: 'December 31, 2028',
        dateStart: 'January 1, 2025',
        durationNumber: 4,
        durationUnit: 'year',
        id: 4,
        office: {
          district: 1,
          id: 9,
          isElected: true,
          office: 'City Councilor',
          position: 2,
        },
        raw: {
          dateEnd: '2028-12-31',
          dateStart: '2025-01-01',
        },
      });
    });
  });

  describe('duration()', () => {
    test('returns the expected value', () => {
      expect(cityOfficeTerm.duration).toEqual('four-year');
    });
  });

  describe('isCurrent()', () => {
    test('returns the expected value', () => {
      expect(cityOfficeTerm.isCurrent()).toBe(true);
    });
  });
});
