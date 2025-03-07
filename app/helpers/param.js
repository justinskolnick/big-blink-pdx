const dateHelper = require('./date');

const SORT_ASC = 'ASC';
const SORT_DESC = 'DESC';
const SORT = {
  [SORT_ASC]: SORT_ASC,
  [SORT_DESC]: SORT_DESC,
};

const SORT_BY_NAME = 'name';
const SORT_BY_TOTAL = 'total';
const SORT_BY = {
  [SORT_BY_NAME]: SORT_BY_NAME,
  [SORT_BY_TOTAL]: SORT_BY_TOTAL,
};

const datePattern = /20[1|2][\d]-[\d]{2}-[\d]{2}/;

const hasDate = (param) => param?.length > 0 && datePattern.test(param);
const hasInteger = (param) => param?.length > 0 && Number.isInteger(Number(param));

const quarterPattern = /Q([1-4])-(20[1-2][0-9])/;

const hasQuarterAndYear = (param) => param?.length > 0 && quarterPattern.test(param);

const getQuarterAndYear = (param) => {
  if (hasQuarterAndYear(param)) {
    const [quarter, year] = param.match(quarterPattern).slice(1,3);

    return [quarter, year].map(Number);
  }

  return null;
};

const getQuarterSlug = (param) =>
  param.toLowerCase().split('-').sort().join('-');

const hasSort = (param) => param in SORT;
const hasSortBy = (param) => param in SORT_BY;

const getSort = (param) => hasSort(param) ? SORT[param] : null;
const getSortBy = (param) => hasSortBy(param) ? SORT_BY[param] : null;

const getParams = searchParams => {
  const values = {};

  if (searchParams.has('sort')) {
    values.sort = getSort(searchParams.get('sort'));
  }

  if (searchParams.has('date_on')) {
    if (hasDate(searchParams.get('date_on'))) {
      values['date_on'] = searchParams.get('date_on');
    }
  }

  if (searchParams.has('with_entity_id')) {
    if (hasInteger(searchParams.get('with_entity_id'))) {
      values['with_entity_id'] = Number(searchParams.get('with_entity_id'));
    }
  }

  if (searchParams.has('with_person_id')) {
    if (hasInteger(searchParams.get('with_person_id'))) {
      values['with_person_id'] = Number(searchParams.get('with_person_id'));
    }
  }

  return values;
};

const getFilters = searchParams => {
  const values = {};

  if (searchParams.has('sort')) {
    values.sort = getSort(searchParams.get('sort'));
  }

  if (searchParams.has('date_on')) {
    if (hasDate(searchParams.get('date_on'))) {
      values['date_on'] = {
        key: 'date_on',
        label: dateHelper.formatDateString(searchParams.get('date_on')),
        value: searchParams.get('date_on'),
      };
    }
  }

  if (searchParams.has('with_entity_id')) {
    if (hasInteger(searchParams.get('with_entity_id'))) {
      values['with_entity_id'] = {
        key: 'with_entity_id',
        label: Number(searchParams.get('with_entity_id')),
        value: Number(searchParams.get('with_entity_id')),
      };
    }
  }

  if (searchParams.has('with_person_id')) {
    if (hasInteger(searchParams.get('with_person_id'))) {
      values['with_person_id'] = {
        key: 'with_person_id',
        label: Number(searchParams.get('with_person_id')),
        value: Number(searchParams.get('with_person_id')),
      };
    }
  }

  return values;
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
  SORT_ASC,
  SORT_DESC,
  SORT_BY_NAME,
  SORT_BY_TOTAL,
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
