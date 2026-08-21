const {
  PARAM_QUARTER,
  PARAM_YEAR,
} = require('../../config/constants');

const {
  getLabel,
  getLabelText,
  getLabelLink,
} = require('./filters');
const {
  getQuarterAndYear,
  getYear,
} = require('../request/search-params');

const LABEL_PREFIX = 'leaderboard';

const getPeriodFilter = (searchParams, options) => {
  const hasYearParam = searchParams.has(PARAM_YEAR);
  const hasQuarterParam = searchParams.has(PARAM_QUARTER);

  if (hasYearParam) {
    const param = searchParams.get(PARAM_YEAR);
    const year = getYear(param);

    if (year) {
      return {
        fields: null,
        labels: [
          getLabelText('intro_during', LABEL_PREFIX),
          getLabel(year),
        ],
        model: null,
        values: {
          [PARAM_YEAR]: param,
        },
      };
    }
  } else if (hasQuarterParam) {
    const param = searchParams.get(PARAM_QUARTER);
    const { year, quarter } = getQuarterAndYear(param);

    if (year && quarter) {
      return {
        fields: null,
        labels: [
          getLabelText('intro_during', LABEL_PREFIX),
          getLabel(`Q${quarter}`),
          getLabelText('of'),
          getLabel(year),
        ],
        model: null,
        values: {
          [PARAM_QUARTER]: param,
        },
      };
    }
  }

  return {
    fields: {
      'year-select': [
        getLabelText('intro_during_imperative', LABEL_PREFIX),
        {
          name: PARAM_YEAR,
          options: options.year,
          type: 'select',
        },
      ],
      'quarter-select': [
        getLabelText('intro_during_imperative', LABEL_PREFIX),
        {
          name: PARAM_QUARTER,
          options: options.quarter,
          type: 'select',
        },
      ],
    },
    labels: [
      getLabelText('intro_during_imperative', LABEL_PREFIX),
      getLabelLink('year-select', null, 'filter_a_year', LABEL_PREFIX),
      getLabelText('or'),
      getLabelLink('quarter-select', null, 'filter_a_quarter', LABEL_PREFIX),
    ],
    model: null,
  };
};

const getFilters = (searchParams, options = {}) => ({
  period: getPeriodFilter(searchParams, options),
});

module.exports = {
  getFilters,
};
