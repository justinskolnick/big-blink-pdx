const {
  ASSOCIATION_ENTITIES,
  ASSOCIATION_LOBBYISTS,
  ASSOCIATION_OFFICIALS,
  PARAM_ASSOCIATION,
  PARAM_DATE_ON,
  PARAM_DATE_RANGE_FROM,
  PARAM_DATE_RANGE_TO,
  PARAM_LIMIT,
  PARAM_PAGE,
  PARAM_PEOPLE,
  PARAM_QUARTER,
  PARAM_ROLE,
  PARAM_SORT,
  PARAM_SORT_BY,
  PARAM_WITH_ENTITY_ID,
  PARAM_WITH_PERSON_ID,
  PARAM_YEAR,
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
  SORT_BY_OPTIONS,
  SORT_OPTIONS,
} = require('./constants');

const DATE_PATTERN = /^20[1|2][\d]-[\d]{2}-[\d]{2}$/;
const PEOPLE_PATTERN = /^([\d]+)(?::([a-z]+))?$/;
const QUARTER_PATTERN = /^(20[1-2][0-9])-q([1-4])$/i;
const QUARTER_PATTERN_DEPRECATED = /^Q([1-4])-(20[1-2][0-9])$/i;
const YEAR_PATTERN = /^20[1-2][0-9]$/;

const dateOptions = {
  pattern: DATE_PATTERN,
  validate: 'hasDate',
};

const integerOptions = {
  adapt: 'getInteger',
  validate: 'hasInteger',
};

const quarterOptions = {
  pattern: QUARTER_PATTERN,
  validate: 'hasQuarter',
};

const peopleOptions = {
  delimiter: ',',
  pattern: PEOPLE_PATTERN,
  validate: 'hasPeople',
};

const yearOptions = {
  pattern: YEAR_PATTERN,
  validate: 'hasYear',
};

const PARAM_OPTIONS = {
  [PARAM_ASSOCIATION]: {
    values: [
      ASSOCIATION_ENTITIES,
      ASSOCIATION_LOBBYISTS,
      ASSOCIATION_OFFICIALS,
    ],
  },
  [PARAM_DATE_ON]: dateOptions,
  [PARAM_DATE_RANGE_FROM]: {
    requires: PARAM_DATE_RANGE_TO,
    ...dateOptions,
  },
  [PARAM_DATE_RANGE_TO]: {
    requires: PARAM_DATE_RANGE_FROM,
    ...dateOptions,
  },
  [PARAM_LIMIT]: integerOptions,
  [PARAM_PAGE]: integerOptions,
  [PARAM_PEOPLE]: peopleOptions,
  [PARAM_QUARTER]: quarterOptions,
  [PARAM_ROLE]: {
    values: [
      ROLE_LOBBYIST,
      ROLE_OFFICIAL,
    ],
  },
  [PARAM_SORT]: {
    adapt: 'getSort',
    values: Object.values(SORT_OPTIONS),
  },
  [PARAM_SORT_BY]: {
    values: Object.values(SORT_BY_OPTIONS),
  },
  [PARAM_WITH_ENTITY_ID]: integerOptions,
  [PARAM_WITH_PERSON_ID]: {
    deprecated: true,
    ...integerOptions,
  },
  [PARAM_YEAR]: yearOptions,
};

module.exports = {
  DATE_PATTERN,
  PARAM_OPTIONS,
  PEOPLE_PATTERN,
  QUARTER_PATTERN,
  QUARTER_PATTERN_DEPRECATED,
  YEAR_PATTERN,
  dateOptions,
  peopleOptions,
  quarterOptions,
  yearOptions,
};
