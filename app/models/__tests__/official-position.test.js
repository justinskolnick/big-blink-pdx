const OfficialPosition = require('../official-position');

/* eslint-disable camelcase */
const result = {
  pernr: 123456,
  name: 'John Doe',
  date_start: '2015-01-01T00:00:00.000Z',
  date_end: '2017-09-15T00:00:00.000Z',
  is_withdrawn: 1,
  is_elected: 0,
  office: 'Mayor',
  position: null,
  district: null,
  responsible_to_pernr: 654321,
  area: 'Office and Policy Management',
  assignment: null,
  classification: null,
  rank: null,
  is_chief: 1,
  role: 'Chief of Staff',
};
const resultWhenElected = {
  ...result,
  is_elected: 1,
  responsible_to_pernr: null,
  role: 'Mayor',
};
/* eslint-enable camelcase */

const adapted = {
  pernr: 123456,
  name: 'John Doe',
  dateStart: '2015-01-01T00:00:00.000Z',
  dateEnd: '2017-09-15T00:00:00.000Z',
  dates: {
    dateFrom: 'January 1, 2015',
    dateTo: 'September 15, 2017',
  },
  office: 'Mayor',
  position: null,
  district: null,
  area: 'Office and Policy Management',
  assignment: null,
  classification: null,
  rank: null,
  isChief: true,
  role: 'Chief of Staff',
};

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
    const officialPosition = new OfficialPosition(result);

    expect(officialPosition.adapted).toEqual(adapted);
  });

  describe('with a null end date', () => {
    describe('and a withdrawal', () => {
      const resultWithNullEndDate = {
        ...result,
        date_end: null, // eslint-disable-line camelcase
      };
      const adaptedWithNullEndDate = {
        ...adapted,
        dateEnd: null,
        dates: {
          ...adapted.dates,
          dateTo: 'unknown',
        },
      };

      test('adapts a result', () => {
        const officialPosition = new OfficialPosition(resultWithNullEndDate);

        expect(officialPosition.adapted).toEqual(adaptedWithNullEndDate);
      });
    });

    describe('and no withdrawal', () => {
      const resultWithNullEndDate = {
        ...result,
        date_end: null, // eslint-disable-line camelcase
        is_withdrawn: 0, // eslint-disable-line camelcase
      };
      const adaptedWithNullEndDate = {
        ...adapted,
        dateEnd: null,
        dates: {
          ...adapted.dates,
          dateTo: null,
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
      ...result,
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

    expect(officialPosition.adapted).toEqual(adapted);
  });
});

describe('isElected()', () => {
  describe('when not elected', () => {
    test('sets data', () => {
      const officialPosition = new OfficialPosition(result);

      expect(officialPosition.isElected).toBe(false);
    });
  });

  describe('when elected', () => {
    test('sets data', () => {
      const officialPosition = new OfficialPosition(resultWhenElected);

      expect(officialPosition.isElected).toBe(true);
    });
  });
});

describe('isSubordinate()', () => {
  describe('when not elected', () => {
    test('sets data', () => {
      const officialPosition = new OfficialPosition(result);

      expect(officialPosition.isSubordinate).toBe(true);
    });
  });

  describe('when elected', () => {
    test('sets data', () => {
      const officialPosition = new OfficialPosition(resultWhenElected);

      expect(officialPosition.isSubordinate).toBe(false);
    });
  });
});
