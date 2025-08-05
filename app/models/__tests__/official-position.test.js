const resultCouncilor = require('../__mocks__/official-position/result-councilor');
const resultCouncilorCos = require('../__mocks__/official-position/result-councilor-cos');
const resultDca = require('../__mocks__/official-position/result-dca');
const resultMayorCos = require('../__mocks__/official-position/result-mayor-cos');
const resultMayor = require('../__mocks__/official-position/result-mayor');
const adaptedMayorCos = require('../__mocks__/official-position/adapted-mayor-cos');
const adaptedCouncilorCos = require('../__mocks__/official-position/adapted-councilor-cos');

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
        ...resultMayorCos,
        date_end: null, // eslint-disable-line camelcase
      };
      const adaptedWithNullEndDate = {
        ...adaptedMayorCos,
        dates: {
          ...adaptedMayorCos.dates,
          end: {
            label: 'unknown',
            value: null,
          },
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
          end: {
            label: null,
            value: null,
          },
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
  const dca = new OfficialPosition(resultDca);
  const mayor = new OfficialPosition(resultMayor);
  const mayorCos = new OfficialPosition(resultMayorCos);

  councilorCos.setSupervisor(councilor.asSupervisor);
  mayorCos.setSupervisor(mayor.asSupervisor);

  describe('hasDistrict()', () => {
    test('returns the expected value', () => {
      expect(councilor.hasDistrict).toBe(true);
      expect(councilorCos.hasDistrict).toBe(true);
      expect(dca.hasDistrict).toBe(false);
      expect(mayor.hasDistrict).toBe(false);
      expect(mayorCos.hasDistrict).toBe(false);
    });
  });

  describe('isElected()', () => {
    test('returns the expected value', () => {
      expect(councilor.isElected).toBe(true);
      expect(councilorCos.isElected).toBe(false);
      expect(dca.isElected).toBe(false);
      expect(mayor.isElected).toBe(true);
      expect(mayorCos.isElected).toBe(false);
    });
  });

  describe('isSubordinate()', () => {
    test('returns the expected value', () => {
      expect(councilor.isSubordinate).toBe(false);
      expect(councilorCos.isSubordinate).toBe(true);
      expect(dca.isSubordinate).toBe(false);
      expect(mayor.isSubordinate).toBe(false);
      expect(mayorCos.isSubordinate).toBe(true);
    });
  });

  describe('isWithdrawn()', () => {
    test('returns the expected value', () => {
      expect(councilor.isWithdrawn).toBe(false);
      expect(councilorCos.isWithdrawn).toBe(false);
      expect(dca.isWithdrawn).toBe(false);
      expect(mayor.isWithdrawn).toBe(true);
      expect(mayorCos.isWithdrawn).toBe(true);
    });
  });

  describe('district()', () => {
    test('returns the expected value', () => {
      expect(councilor.district).toBe(3);
      expect(councilorCos.district).toBe(3);
      expect(dca.district).toBe(null);
      expect(mayor.district).toBe(null);
      expect(mayorCos.district).toBe(null);
    });
  });

  describe('role()', () => {
    test('returns the expected value', () => {
      expect(councilor.role).toBe('Councilor');
      expect(councilorCos.role).toBe('Senior Council Aide');
      expect(dca.role).toBe('Deputy City Administrator');
      expect(mayor.role).toBe('Mayor');
      expect(mayorCos.role).toBe('Chief of Staff');
    });
  });

  describe('roleStatement()', () => {
    test('returns the expected value', () => {
      expect(councilor.roleStatement).toBe('Councilor for District 3');
      expect(councilorCos.roleStatement).toBe('Senior Council Aide for Councilor June Doe (District 3)');
      expect(dca.roleStatement).toBe('Deputy City Administrator of Community and Economic Development');
      expect(mayor.roleStatement).toBe('Mayor');
      expect(mayorCos.roleStatement).toBe('Chief of Staff for Mayor Jane Doe');
    });
  });

  describe('titleAsSupervisor()', () => {
    test('returns the expected value', () => {
      expect(councilor.titleAsSupervisor).toBe('Councilor June Doe');
      expect(councilorCos.titleAsSupervisor).toBe(null);
      expect(dca.titleAsSupervisor).toBe('Deputy City Administrator John Doe');
      expect(mayor.titleAsSupervisor).toBe('Mayor Jane Doe');
      expect(mayorCos.titleAsSupervisor).toBe(null);
    });
  });
});
