const resultCityOfficeCityCommissioner = require('../__mocks__/city-office/result-city-commissioner.json');
const resultCityOfficeCityCouncilor = require('../__mocks__/city-office/result-city-councilor.json');
const resultCityOfficeMayor = require('../__mocks__/city-office/result-mayor.json');
const resultCityCommissioner = require('../__mocks__/city-office-term/result-city-commissioner.json');
const resultCityCouncilor = require('../__mocks__/city-office-term/result-city-councilor.json');
const resultMayor = require('../__mocks__/city-office-term/result-mayor.json');
const resultMayorPriorDates = require('../__mocks__/city-office-term/result-mayor-prior-dates.json');
const resultMayorPriorPosition = require('../__mocks__/city-office-term/result-mayor-prior-position.json');

const CityOffice = require('../city-office');
const CityOfficeTerm = require('../city-office-term');

describe('className()', () => {
  test('returns the expected field', () => {
    expect(CityOfficeTerm.className()).toBe('CityOfficeTerm');
  });
});

describe('collect', () => {
  let offices;

  beforeAll(() => {
    offices = [
      resultCityOfficeCityCommissioner,
      resultCityOfficeCityCouncilor,
      resultCityOfficeMayor,
    ];
  });

  afterAll(() => {
    offices = undefined;
  });

  describe('with a reelection', () => {
    let cityOffice;
    let results;
    let collected;
    let adapted;

    beforeAll(() => {
      results = [
        resultMayor,
        resultMayorPriorDates,
        resultMayorPriorPosition,
      ].map(result => {
        const cityOfficeTerm = new CityOfficeTerm(result);

        cityOffice = new CityOffice(offices.find(office => office.id === result.city_office_id));
        cityOfficeTerm.setCityOffice(cityOffice);

        return cityOfficeTerm;
      });

      collected = CityOfficeTerm.collect(results);
      adapted = collected.map(result => result.adapted);
    });

    afterAll(() => {
      cityOffice = undefined;
      results = undefined;
      collected = undefined;
      adapted = undefined;
    });

    test('returns the expected array', () => {
      expect(results).toHaveLength(3);
      expect(collected).toHaveLength(2);
      expect(adapted).toHaveLength(2);

      expect(adapted).toEqual([
        {
          dateEnd: 'December 31, 2028',
          dateStart: 'January 1, 2021',
          id: 3,
          office: {
            district: null,
            id: 1,
            isElected: true,
            office: 'Mayor',
            position: null,
          },
          raw: {
            dateEnd: '2028-12-31',
            dateStart: '2021-01-01',
          },
          tenure: {
            number: 96,
            unit: 'month',
          },
        },
        {
          dateEnd: 'December 31, 2020',
          dateStart: 'January 1, 2017',
          id: 1,
          office: {
            district: null,
            id: 6,
            isElected: true,
            office: 'City Commissioner',
            position: 4,
          },
          raw: {
            dateEnd: '2020-12-31',
            dateStart: '2017-01-01',
          },
          tenure: {
            number: 48,
            unit: 'month',
          },
        },
      ]);
    });

    describe('wasReelected()', () => {
      test('returns the expected value', () => {
        expect(collected.at(0).wasReelected()).toBe(true);
        expect(collected.at(1).wasReelected()).toBe(false);
      });
    });

    describe('tenure', () => {
      test('returns the expected value', () => {
        expect(collected.at(0).tenure).toEqual({
          number: 96,
          unit: 'month',
        });
        expect(collected.at(1).tenure).toEqual({
          number: 48,
          unit: 'month',
        });
      });
    });

    describe('termCount', () => {
      test('returns the expected value', () => {
        expect(collected.at(0).termCount).toBe(2);
        expect(collected.at(1).termCount).toBe(1);
      });
    });
  });
});

describe('with a mayor', () => {
  let cityOffice;
  let cityOfficeTerm;

  beforeAll(() => {
    cityOffice = new CityOffice(resultCityOfficeMayor);
    cityOfficeTerm = new CityOfficeTerm(resultMayor);

    cityOfficeTerm.setCityOffice(cityOffice);
  });

  afterAll(() => {
    cityOffice = undefined;
    cityOfficeTerm = undefined;
  });

  describe('adapt()', () => {
    test('returns the expected object', () => {
      expect(cityOfficeTerm.adapted).toEqual({
        dateEnd: 'December 31, 2028',
        dateStart: 'January 1, 2025',
        id: 3,
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
        tenure: {
          number: 48,
          unit: 'month',
        },
      });
    });
  });

  describe('readableTenure()', () => {
    test('returns the expected value', () => {
      expect(cityOfficeTerm.readableTenure).toEqual('four-year');
    });
  });

  describe('isCurrent()', () => {
    test('returns the expected value', () => {
      expect(cityOfficeTerm.isCurrent()).toBe(true);
    });
  });

  describe('wasReelected()', () => {
    test('returns the expected value', () => {
      expect(cityOfficeTerm.wasReelected()).toBe(false);
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
        tenure: {
          number: 48,
          unit: 'month',
        },
      });
    });
  });

  describe('readableTenure()', () => {
    test('returns the expected value', () => {
      expect(cityOfficeTerm.readableTenure).toEqual('four-year');
    });
  });

  describe('isCurrent()', () => {
    test('returns the expected value', () => {
      expect(cityOfficeTerm.isCurrent()).toBe(false);
    });
  });

  describe('wasReelected()', () => {
    test('returns the expected value', () => {
      expect(cityOfficeTerm.wasReelected()).toBe(false);
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
        tenure: {
          number: 48,
          unit: 'month',
        },
      });
    });
  });

  describe('readableTenure()', () => {
    test('returns the expected value', () => {
      expect(cityOfficeTerm.readableTenure).toEqual('four-year');
    });
  });

  describe('isCurrent()', () => {
    test('returns the expected value', () => {
      expect(cityOfficeTerm.isCurrent()).toBe(true);
    });
  });

  describe('wasReelected()', () => {
    test('returns the expected value', () => {
      expect(cityOfficeTerm.wasReelected()).toBe(false);
    });
  });
});
