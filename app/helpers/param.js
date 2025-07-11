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
  QUARTER_PATTERN_ALT,
  YEAR_PATTERN,
} = require('../config/patterns');

const hasParam = (param) => param?.length > 0;
const hasDate = (param) => hasParam(param) && DATE_PATTERN.test(param);
const hasInteger = (param) => hasParam(param) && Number.isInteger(Number(param));
const hasQuarter = (param) => hasParam(param) && (QUARTER_PATTERN.test(param) || QUARTER_PATTERN_ALT.test(param));
const hasQuarterAndYear = (param) => hasParam(param) && QUARTER_PATTERN.test(param);
const hasYear = (param) => hasParam(param) && YEAR_PATTERN.test(param);
const hasYearAndQuarter = (param) => hasParam(param) && QUARTER_PATTERN_ALT.test(param);
const hasValidQuarter = (param) => hasQuarterAndYear(param) || hasYearAndQuarter(param);

const getQuarterAndYear = (param) => {
  let quarter;
  let year;

  if (hasQuarterAndYear(param)) {
    [quarter, year] = param.match(QUARTER_PATTERN).slice(1,3).map(Number);
  } else if (hasYearAndQuarter(param)) {
    [year, quarter] = param.match(QUARTER_PATTERN_ALT).slice(1,3).map(Number);
  }

  if (quarter && year) {
    return { quarter, year };
  }

  return null;
};

const getQuarterSlug = (param) =>
  param.toLowerCase().split('-').sort().join('-');

const migrateQuarterSlug = param => {
  if (hasValidQuarter(param)) {
    return getQuarterSlug(param);
  }

  return null;
};

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

const getParamsFromFilters = (searchParams, filters) => {
  const params = Object.entries(filters)
    .filter(([, domain]) => domain && 'values' in domain)
    .map(([, domain]) => domain.values)
    .reduce((all, values) => Object.assign(all, values), {});

  if (searchParams.has(PARAM_SORT)) {
    params[PARAM_SORT] = getSort(searchParams.get(PARAM_SORT));
  }

  return params;
};

const getInvalidValueMessage = (param, value) => `<strong>${value}</strong> is not a valid value for <code>${param}</code>`;
const getOutOfRangeValueMessage = (param, value) => `<strong>${value}</strong> is out of range for <code>${param}</code>`;

module.exports = {
  getInvalidValueMessage,
  getOutOfRangeValueMessage,
  getParams,
  getParamsFromFilters,
  getQuarterAndYear,
  getQuarterSlug,
  getSort,
  getSortBy,
  hasDate,
  hasInteger,
  hasQuarter,
  hasQuarterAndYear,
  hasSort,
  hasSortBy,
  hasValidQuarter,
  hasYear,
  hasYearAndQuarter,
  migrateQuarterSlug,
};
