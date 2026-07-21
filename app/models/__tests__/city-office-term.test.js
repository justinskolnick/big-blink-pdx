const resultCityOfficeCityCommissioner = require('../__mocks__/city-office/result-city-commissioner.json');
const resultCityOfficeCityCouncilor = require('../__mocks__/city-office/result-city-councilor.json');
const resultCityOfficeMayor = require('../__mocks__/city-office/result-mayor.json');
const resultCityCommissioner = require('../__mocks__/city-office-term/result-city-commissioner.json');
const resultCityCouncilor = require('../__mocks__/city-office-term/result-city-councilor.json');
const resultMayor = require('../__mocks__/city-office-term/result-mayor.json');
const resultMayorPriorDates = require('../__mocks__/city-office-term/result-mayor-prior-dates.json');
const resultMayorPriorPosition = require('../__mocks__/city-office-term/result-mayor-prior-position.json');
const resultElection2024General = require('../__mocks__/elections/result-2024-general.json');
const resultElection2020General = require('../__mocks__/elections/result-2020-general.json');
const resultElection2016General = require('../__mocks__/elections/result-2016-general.json');

const CityOffice = require('../city-office');
const CityOfficeTerm = require('../city-office-term');
const Election = require('../election');

describe('className()', () => {
  test('returns the expected field', () => {
    expect(CityOfficeTerm.className()).toBe('CityOfficeTerm');
  });
});

describe('collect', () => {
  let cityOffices;
  let elections;

  beforeAll(() => {
    cityOffices = [
      resultCityOfficeCityCommissioner,
      resultCityOfficeCityCouncilor,
      resultCityOfficeMayor,
    ];
    elections = [
      resultElection2016General,
      resultElection2020General,
      resultElection2024General,
    ];
  });

  afterAll(() => {
    cityOffices = undefined;
    elections = undefined;
  });

  describe('with a reelection', () => {
    let cityOffice;
    let election;
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

        cityOffice = new CityOffice(cityOffices.find(office => office.id === result.city_office_id));
        election = new Election(elections.find(election => election.id === result.election_id));

        cityOfficeTerm.setCityOffice(cityOffice);
        cityOfficeTerm.setElection(election);

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
          election: {
            date: {
              label: 'November 5, 2024',
              value: '2024-11-05',
            },
            id: 5,
            type: 'general',
            year: 2024,
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
          election: {
            date: {
              label: 'November 8, 2016',
              value: '2016-11-08',
            },
            id: 24,
            type: 'general',
            year: 2016,
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
  let election;

  beforeAll(() => {
    cityOffice = new CityOffice(resultCityOfficeMayor);
    cityOfficeTerm = new CityOfficeTerm(resultMayor);
    election = new Election(resultElection2024General);

    cityOfficeTerm.setCityOffice(cityOffice);
    cityOfficeTerm.setElection(election);
  });

  afterAll(() => {
    cityOffice = undefined;
    cityOfficeTerm = undefined;
    election = undefined;
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
        election: {
          date: {
            label: 'November 5, 2024',
            value: '2024-11-05',
          },
          id: 5,
          type: 'general',
          year: 2024,
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
  let cityOffice;
  let cityOfficeTerm;
  let election;

  beforeAll(() => {
    cityOffice = new CityOffice(resultCityOfficeCityCommissioner);
    cityOfficeTerm = new CityOfficeTerm(resultCityCommissioner);
    election = new Election(resultElection2020General);

    cityOfficeTerm.setCityOffice(cityOffice);
    cityOfficeTerm.setElection(election);
  });

  afterAll(() => {
    cityOffice = undefined;
    cityOfficeTerm = undefined;
    election = undefined;
  });

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
        election: {
          date: {
            label: 'November 3, 2020',
            value: '2020-11-03',
          },
          id: 13,
          type: 'general',
          year: 2020,
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
  let cityOffice;
  let cityOfficeTerm;
  let election;

  beforeAll(() => {
    cityOffice = new CityOffice(resultCityOfficeCityCouncilor);
    cityOfficeTerm = new CityOfficeTerm(resultCityCouncilor);
    election = new Election(resultElection2024General);

    cityOfficeTerm.setCityOffice(cityOffice);
    cityOfficeTerm.setElection(election);
  });

  afterAll(() => {
    cityOffice = undefined;
    cityOfficeTerm = undefined;
    election = undefined;
  });

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
        election: {
          date: {
            label: 'November 5, 2024',
            value: '2024-11-05',
          },
          id: 5,
          type: 'general',
          year: 2024,
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
