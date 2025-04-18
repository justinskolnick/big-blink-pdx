const {
  PARAM_DATE_ON,
  PARAM_DATE_RANGE_FROM,
  PARAM_DATE_RANGE_TO,
  PARAM_SORT,
  PARAM_WITH_ENTITY_ID,
  PARAM_WITH_PERSON_ID,
  SORT_BY_OPTIONS,
  SORT_OPTIONS,
} = require('../config/constants');
const {
  DATE_PATTERN,
  QUARTER_PATTERN,
} = require('../config/patterns');

const dateHelper = require('./date');
const {
  getDatesFilter,
  getEntitiesFilter,
  getPeopleFilter,
} = require('./filters');

const hasDate = (param) => param?.length > 0 && DATE_PATTERN.test(param);
const hasInteger = (param) => param?.length > 0 && Number.isInteger(Number(param));
const hasQuarterAndYear = (param) => param?.length > 0 && QUARTER_PATTERN.test(param);

const getQuarterAndYear = (param) => {
  if (hasQuarterAndYear(param)) {
    const [quarter, year] = param.match(QUARTER_PATTERN).slice(1,3);

    return [quarter, year].map(Number);
  }

  return null;
};

const getQuarterSlug = (param) =>
  param.toLowerCase().split('-').sort().join('-');

const hasSort = (param) => param in SORT_OPTIONS;
const hasSortBy = (param) => param in SORT_BY_OPTIONS;

const getSort = (param) => hasSort(param) ? SORT_OPTIONS[param] : null;
const getSortBy = (param) => hasSortBy(param) ? SORT_BY_OPTIONS[param] : null;

const getParams = searchParams => {
  const values = {};

  if (searchParams.has(PARAM_SORT)) {
    values.sort = getSort(searchParams.get(PARAM_SORT));
  }

  if (searchParams.has(PARAM_DATE_ON)) {
    if (hasDate(searchParams.get(PARAM_DATE_ON))) {
      values[PARAM_DATE_ON] = searchParams.get(PARAM_DATE_ON);
    }
  }

  if ([PARAM_DATE_RANGE_FROM, PARAM_DATE_RANGE_TO].every(p => searchParams.has(p))) {
    if ([PARAM_DATE_RANGE_FROM, PARAM_DATE_RANGE_TO].every(p => hasDate(searchParams.get(p)))) {
      [PARAM_DATE_RANGE_FROM, PARAM_DATE_RANGE_TO].forEach(p => {
        values[p] = searchParams.get(p);
      });
    }
  }

  if (searchParams.has(PARAM_WITH_ENTITY_ID)) {
    if (hasInteger(searchParams.get(PARAM_WITH_ENTITY_ID))) {
      values[PARAM_WITH_ENTITY_ID] = Number(searchParams.get(PARAM_WITH_ENTITY_ID));
    }
  }

  if (searchParams.has(PARAM_WITH_PERSON_ID)) {
    if (hasInteger(searchParams.get(PARAM_WITH_PERSON_ID))) {
      values[PARAM_WITH_PERSON_ID] = Number(searchParams.get(PARAM_WITH_PERSON_ID));
    }
  }

  return values;
};

const getFilters = searchParams => {
  const filters = {};

  if (searchParams.has(PARAM_SORT)) {
    filters.sort = getSort(searchParams.get(PARAM_SORT));
  }

  const hasDateOn = searchParams.has(PARAM_DATE_ON) && hasDate(searchParams.get(PARAM_DATE_ON));
  const hasDateRange = [PARAM_DATE_RANGE_FROM, PARAM_DATE_RANGE_TO].every(p => searchParams.has(p) && hasDate(searchParams.get(p)));

  filters.dates = getDatesFilter(searchParams);
  filters.entities = getEntitiesFilter(searchParams);
  filters.people = getPeopleFilter(searchParams);

  if (hasDateOn) {
    filters[PARAM_DATE_ON] = {
      key: PARAM_DATE_ON,
      label: dateHelper.formatDateString(searchParams.get(PARAM_DATE_ON)),
      value: searchParams.get(PARAM_DATE_ON),
    };
  } else if (hasDateRange) {
    [PARAM_DATE_RANGE_FROM, PARAM_DATE_RANGE_TO].forEach(p => {
      filters[p] = {
        key: p,
        label: dateHelper.formatDateString(searchParams.get(p)),
        value: searchParams.get(p),
      };
    });
  }

  if (searchParams.has(PARAM_WITH_ENTITY_ID)) {
    if (hasInteger(searchParams.get(PARAM_WITH_ENTITY_ID))) {
      filters[PARAM_WITH_ENTITY_ID] = {
        key: PARAM_WITH_ENTITY_ID,
        label: Number(searchParams.get(PARAM_WITH_ENTITY_ID)),
        value: Number(searchParams.get(PARAM_WITH_ENTITY_ID)),
      };
    }
  }

  if (searchParams.has(PARAM_WITH_PERSON_ID)) {
    if (hasInteger(searchParams.get(PARAM_WITH_PERSON_ID))) {
      filters[PARAM_WITH_PERSON_ID] = {
        key: PARAM_WITH_PERSON_ID,
        label: Number(searchParams.get(PARAM_WITH_PERSON_ID)),
        value: Number(searchParams.get(PARAM_WITH_PERSON_ID)),
      };
    }
  }

  return filters;
};

const getParamsFromFilters = filters =>
  Object.entries(filters).reduce((all, [key, values]) => {
    if (typeof values === 'object') {
      all[key] = values.value;
    } else {
      all[key] = values;
    }

    return all;
  }, {});

const getInvalidValueMessage = (param, value) => `<strong>${value}</strong> is not a valid value for <code>${param}</code>`;

module.exports = {
  getFilters,
  getInvalidValueMessage,
  getParams,
  getParamsFromFilters,
  getQuarterAndYear,
  getQuarterSlug,
  getSort,
  getSortBy,
  hasDate,
  hasInteger,
  hasQuarterAndYear,
  hasSort,
  hasSortBy,
};
