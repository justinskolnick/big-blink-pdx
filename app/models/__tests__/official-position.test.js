const adaptedCouncilorCos = require('../__mocks__/official-position/adapted-councilor-cos');
const adaptedMayorCos = require('../__mocks__/official-position/adapted-mayor-cos');
const resultCouncilor = require('../__mocks__/official-position/result-councilor');
const resultCouncilorCos = require('../__mocks__/official-position/result-councilor-cos');
const resultCouncilorCosWithdrawn = require('../__mocks__/official-position/result-councilor-cos-withdrawn');
const resultDca = require('../__mocks__/official-position/result-dca');
const resultMayor = require('../__mocks__/official-position/result-mayor');
const resultMayorCos = require('../__mocks__/official-position/result-mayor-cos');
const resultMayorCosWithdrawn = require('../__mocks__/official-position/result-mayor-cos-withdrawn');
const resultMayorWithdrawn = require('../__mocks__/official-position/result-mayor-withdrawn');
const resultsCouncilor = require('../__mocks__/official-position/results-councilor');

const OfficialPosition = require('../official-position');

describe('tableName', () => {
  test('returns the expected tableName', () => {
    expect(OfficialPosition.tableName).toBe('official_positions');
  });
});

describe('getLabel()', () => {
  test('returns the expected labels', () => {
    expect(OfficialPosition.getLabel('unknown', 'official_positions')).toBe('unknown');
  });
});

describe('fields()', () => {
  test('returns the expected fields', () => {
    expect(OfficialPosition.fields()).toEqual([
      'official_positions.pernr',
      'official_positions.name',
      'official_positions.date_start',
      'official_positions.date_end',
      'official_positions.is_withdrawn',
      'official_positions.is_elected',
      'official_positions.office',
      'official_positions.position',
      'official_positions.district',
      'official_positions.responsible_to_pernr',
      'official_positions.area',
      'official_positions.assignment',
      'official_positions.classification',
      'official_positions.rank',
      'official_positions.is_chief',
      'official_positions.role',
    ]);
  });
});

describe('adapt()', () => {
  test('adapts a result', () => {
    const mayorCos = new OfficialPosition(resultMayorCos);
    const councilorCos = new OfficialPosition(resultCouncilorCos);

    expect(mayorCos.adapted).toEqual(adaptedMayorCos);
    expect(councilorCos.adapted).toEqual(adaptedCouncilorCos);
  });

  describe('with a null end date', () => {
    describe('and a withdrawal', () => {
      const resultWithNullEndDate = {
        ...resultMayorCosWithdrawn,
        date_end: null, // eslint-disable-line camelcase
      };
      const adaptedWithNullEndDate = {
        ...adaptedMayorCos,
        dates: {
          ...adaptedMayorCos.dates,
          end: null,
        },
      };

      test('adapts a result', () => {
        const officialPosition = new OfficialPosition(resultWithNullEndDate);

        expect(officialPosition.adapted).toEqual(adaptedWithNullEndDate);
      });
    });

    describe('and no withdrawal', () => {
      const resultWithNullEndDate = {
        ...resultMayorCos,
        date_end: null, // eslint-disable-line camelcase
        is_withdrawn: 0, // eslint-disable-line camelcase
      };
      const adaptedWithNullEndDate = {
        ...adaptedMayorCos,
        dates: {
          ...adaptedMayorCos.dates,
          end: null,
        },
      };

      test('adapts a result', () => {
        const officialPosition = new OfficialPosition(resultWithNullEndDate);

        expect(officialPosition.adapted).toEqual(adaptedWithNullEndDate);
      });
    });
  });
});

describe('setData()', () => {
  test('sets data', () => {
    const resultWithExtra = {
      ...resultMayorCos,
      x: 'y',
    };
    const officialPosition = new OfficialPosition(resultWithExtra);

    officialPosition.setData('z', 'abc');

    expect(officialPosition.hasData()).toBe(true);
    expect(officialPosition.hasLinks()).toBe(false);

    expect(officialPosition.data).toEqual({
      ...resultWithExtra,
      z: 'abc',
    });

    expect(officialPosition.adapted).toEqual(adaptedMayorCos);
  });
});

describe('setName()', () => {
  test('sets the new name', () => {
    const resultToBeChanged = {
      ...resultDca,
    };
    const officialPosition = new OfficialPosition(resultToBeChanged);

    expect(officialPosition.personalName).toBe('John Doe');

    officialPosition.setName('Jonathan Z. Doe');

    expect(officialPosition.personalName).toBe('Jonathan Z. Doe');
  });
});

describe('positions', () => {
  const councilor = new OfficialPosition(resultCouncilor);
  const councilorCos = new OfficialPosition(resultCouncilorCos);
  const councilorCosWithdrawn = new OfficialPosition(resultCouncilorCosWithdrawn);
  const dca = new OfficialPosition(resultDca);
  const mayor = new OfficialPosition(resultMayor);
  const mayorWithdrawn = new OfficialPosition(resultMayorWithdrawn);
  const mayorCos = new OfficialPosition(resultMayorCos);
  const mayorCosWithdrawn = new OfficialPosition(resultMayorCosWithdrawn);

  councilorCos.setSupervisor(councilor.asSupervisor);
  councilorCosWithdrawn.setSupervisor(councilor.asSupervisor);
  mayorCos.setSupervisor(mayor.asSupervisor);
  mayorCosWithdrawn.setSupervisor(mayor.asSupervisor);

  describe('hasDistrict()', () => {
    test('returns the expected value', () => {
      expect(councilor.hasDistrict).toBe(true);
      expect(councilorCos.hasDistrict).toBe(true);
      expect(councilorCosWithdrawn.hasDistrict).toBe(true);
      expect(dca.hasDistrict).toBe(false);
      expect(mayor.hasDistrict).toBe(false);
      expect(mayorWithdrawn.hasDistrict).toBe(false);
      expect(mayorCos.hasDistrict).toBe(false);
      expect(mayorCosWithdrawn.hasDistrict).toBe(false);
    });
  });

  describe('isAssumedCurrent()', () => {
    test('returns the expected value', () => {
      expect(councilor.isAssumedCurrent).toBe(false);
      expect(councilorCos.isAssumedCurrent).toBe(false);
      expect(councilorCosWithdrawn.isAssumedCurrent).toBe(false);
      expect(dca.isAssumedCurrent).toBe(false);
      expect(mayor.isAssumedCurrent).toBe(true);
      expect(mayorWithdrawn.isAssumedCurrent).toBe(false);
      expect(mayorCos.isAssumedCurrent).toBe(true);
      expect(mayorCosWithdrawn.isAssumedCurrent).toBe(false);
    });
  });

  describe('isElected()', () => {
    test('returns the expected value', () => {
      expect(councilor.isElected).toBe(true);
      expect(councilorCos.isElected).toBe(false);
      expect(councilorCosWithdrawn.isElected).toBe(false);
      expect(dca.isElected).toBe(false);
      expect(mayor.isElected).toBe(true);
      expect(mayorWithdrawn.isElected).toBe(true);
      expect(mayorCos.isElected).toBe(false);
      expect(mayorCosWithdrawn.isElected).toBe(false);
    });
  });

  describe('isSubordinate()', () => {
    test('returns the expected value', () => {
      expect(councilor.isSubordinate).toBe(false);
      expect(councilorCos.isSubordinate).toBe(true);
      expect(councilorCosWithdrawn.isSubordinate).toBe(true);
      expect(dca.isSubordinate).toBe(false);
      expect(mayor.isSubordinate).toBe(false);
      expect(mayorWithdrawn.isSubordinate).toBe(false);
      expect(mayorCos.isSubordinate).toBe(true);
      expect(mayorCosWithdrawn.isSubordinate).toBe(true);
    });
  });

  describe('isWithdrawn()', () => {
    test('returns the expected value', () => {
      expect(councilor.isWithdrawn).toBe(false);
      expect(councilorCos.isWithdrawn).toBe(false);
      expect(councilorCosWithdrawn.isWithdrawn).toBe(true);
      expect(dca.isWithdrawn).toBe(false);
      expect(mayor.isWithdrawn).toBe(false);
      expect(mayorWithdrawn.isWithdrawn).toBe(true);
      expect(mayorCos.isWithdrawn).toBe(false);
      expect(mayorCosWithdrawn.isWithdrawn).toBe(true);
    });
  });

  describe('dateStart()', () => {
    test('returns the expected value', () => {
      expect(councilor.dateStart).toBe('2015-01-01T00:00:00.000Z');
      expect(councilorCos.dateStart).toBe('2015-01-01T00:00:00.000Z');
      expect(councilorCosWithdrawn.dateStart).toBe('2015-01-01T00:00:00.000Z');
      expect(dca.dateStart).toBe('2015-01-01T00:00:00.000Z');
      expect(mayor.dateStart).toBe('2015-01-01T00:00:00.000Z');
      expect(mayorWithdrawn.dateStart).toBe('2015-01-01T00:00:00.000Z');
      expect(mayorCos.dateStart).toBe('2015-01-01T00:00:00.000Z');
      expect(mayorCosWithdrawn.dateStart).toBe('2015-01-01T00:00:00.000Z');
    });
  });

  describe('dateEnd()', () => {
    test('returns the expected value', () => {
      expect(councilor.dateEnd).toBe('2017-09-15T00:00:00.000Z');
      expect(councilorCos.dateEnd).toBe('2017-09-15T00:00:00.000Z');
      expect(councilorCosWithdrawn.dateEnd).toBe('2017-09-15T00:00:00.000Z');
      expect(dca.dateEnd).toBe('2017-09-15T00:00:00.000Z');
      expect(mayor.dateEnd).toBe(null);
      expect(mayorWithdrawn.dateEnd).toBe('2017-09-15T00:00:00.000Z');
      expect(mayorCos.dateEnd).toBe(null);
      expect(mayorCosWithdrawn.dateEnd).toBe('2017-09-15T00:00:00.000Z');
    });
  });

  describe('district()', () => {
    test('returns the expected value', () => {
      expect(councilor.district).toBe(3);
      expect(councilorCos.district).toBe(3);
      expect(councilorCosWithdrawn.district).toBe(3);
      expect(dca.district).toBe(null);
      expect(mayor.district).toBe(null);
      expect(mayorWithdrawn.district).toBe(null);
      expect(mayorCos.district).toBe(null);
      expect(mayorCosWithdrawn.district).toBe(null);
    });
  });

  describe('responsibleToPernr()', () => {
    test('returns the expected value', () => {
      expect(councilor.responsibleToPernr).toBe(null);
      expect(councilorCos.responsibleToPernr).toBe(654321);
      expect(councilorCosWithdrawn.responsibleToPernr).toBe(654321);
      expect(dca.responsibleToPernr).toBe(null);
      expect(mayor.responsibleToPernr).toBe(null);
      expect(mayorWithdrawn.responsibleToPernr).toBe(null);
      expect(mayorCos.responsibleToPernr).toBe(654321);
      expect(mayorCosWithdrawn.responsibleToPernr).toBe(654321);
    });
  });

  describe('role()', () => {
    test('returns the expected value', () => {
      expect(councilor.role).toBe('Councilor');
      expect(councilorCos.role).toBe('Senior Council Aide');
      expect(councilorCosWithdrawn.role).toBe('Senior Council Aide');
      expect(dca.role).toBe('Deputy City Administrator');
      expect(mayor.role).toBe('Mayor');
      expect(mayorWithdrawn.role).toBe('Mayor');
      expect(mayorCos.role).toBe('Chief of Staff');
      expect(mayorCosWithdrawn.role).toBe('Chief of Staff');
    });
  });

  describe('roleStatement()', () => {
    test('returns the expected value', () => {
      expect(councilor.roleStatement).toBe('Councilor for District 3');
      expect(councilorCos.roleStatement).toBe('Senior Council Aide for Councilor June Doe (District 3)');
      expect(councilorCosWithdrawn.roleStatement).toBe('Senior Council Aide for Councilor June Doe (District 3)');
      expect(dca.roleStatement).toBe('Deputy City Administrator of Community and Economic Development');
      expect(mayor.roleStatement).toBe('Mayor');
      expect(mayorWithdrawn.roleStatement).toBe('Mayor');
      expect(mayorCos.roleStatement).toBe('Chief of Staff for Mayor Jane Doe');
      expect(mayorCosWithdrawn.roleStatement).toBe('Chief of Staff for Mayor Jane Doe');
    });
  });

  describe('titleAsSupervisor()', () => {
    test('returns the expected value', () => {
      expect(councilor.titleAsSupervisor).toBe('Councilor June Doe');
      expect(councilorCos.titleAsSupervisor).toBe(null);
      expect(councilorCosWithdrawn.titleAsSupervisor).toBe(null);
      expect(dca.titleAsSupervisor).toBe('Deputy City Administrator John Doe');
      expect(mayor.titleAsSupervisor).toBe('Mayor Jane Doe');
      expect(mayorWithdrawn.titleAsSupervisor).toBe('Mayor Jane Doe');
      expect(mayorCos.titleAsSupervisor).toBe(null);
      expect(mayorCosWithdrawn.titleAsSupervisor).toBe(null);
    });
  });
});

describe('collect', () => {
  test('returns the expected array', () => {
    const results = resultsCouncilor.map(result => new OfficialPosition(result));
    const collected = OfficialPosition.collect(results);
    const adapted = collected.map(result => result.adapted);

    expect(results).toHaveLength(6);
    expect(collected).toHaveLength(4);
    expect(adapted).toHaveLength(4);

    expect(adapted).toEqual([
      {
        dates: {
          end: '2016-06-30T00:00:00.000Z',
          start: '2013-06-06T00:00:00.000Z',
        },
        role: 'Commissioner',
      },
      {
        dates: {
          end: '2016-12-31T00:00:00.000Z',
          start: '2016-07-01T00:00:00.000Z',
        },
        role: 'Commissioner',
      },
      {
        dates: {
          end: '2024-12-31T00:00:00.000Z',
          start: '2017-01-01T00:00:00.000Z',
        },
        role: 'Commissioner',
      },
      {
        dates: {
          end: null,
          start: '2025-01-01T00:00:00.000Z',
        },
        role: 'Councilor for District 3',
      },
    ]);
  });
});
