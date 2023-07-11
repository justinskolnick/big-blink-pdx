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

const quarterPattern = /Q([1-4])-(20[1-2][0-9])/;

const hasQuarterAndYear = (param) => param?.length > 0 && quarterPattern.test(param);

const getQuarterAndYear = (param) => {
  if (hasQuarterAndYear(param)) {
    const [quarter, year] = param.match(quarterPattern).slice(1,3);

    return [quarter, year].map(Number);
  }

  return null;
};

const hasSort = (param) => param in SORT;
const hasSortBy = (param) => param in SORT_BY;

const getSort = (param) => hasSort(param) ? SORT[param] : null;
const getSortBy = (param) => hasSortBy(param) ? SORT_BY[param] : null;

const getInvalidValueMessage = (param, value) => `<strong>${value}</strong> is not a valid value for <code>${param}</code>`;

module.exports = {
  SORT_ASC,
  SORT_DESC,
  SORT_BY_NAME,
  SORT_BY_TOTAL,
  getInvalidValueMessage,
  getQuarterAndYear,
  getSort,
  getSortBy,
  hasQuarterAndYear,
  hasSort,
  hasSortBy,
};
