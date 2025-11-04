const {
  PARAM_QUARTER,
  PARAM_YEAR,
} = require('../../config/constants');

const { Labels } = require('../../helpers/labels');

const {
  getLabel,
  getLabelText,
  getLabelLink,
} = require('./filters');
const {
  getQuarterAndYear,
  getYear,
} = require('../request/search-params');

const labels = new Labels();

const getPeriodFilter = (searchParams, options) => {
  const hasYearParam = searchParams.has(PARAM_YEAR);
  const hasQuarterParam = searchParams.has(PARAM_QUARTER);
  const labelPrefix = 'leaderboard';

  if (hasYearParam) {
    const param = searchParams.get(PARAM_YEAR);
    const year = getYear(param);

    if (year) {
      return {
        fields: null,
        labels: [
          getLabelText(labels.getLabel('intro_during', labelPrefix)),
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
          getLabelText(labels.getLabel('intro_during', labelPrefix)),
          getLabel(`Q${quarter}`),
          getLabelText(labels.getLabel('of')),
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
        getLabelText(labels.getLabel('intro_during_imperative', labelPrefix)),
        {
          name: PARAM_YEAR,
          options: options.year,
          type: 'select',
        },
      ],
      'quarter-select': [
        getLabelText(labels.getLabel('intro_during_imperative', labelPrefix)),
        {
          name: PARAM_QUARTER,
          options: options.quarter,
          type: 'select',
        },
      ],
    },
    labels: [
      getLabelText(labels.getLabel('intro_during_imperative', labelPrefix)),
      getLabelLink('year-select', null, labels.getLabel('filter_a_year', labelPrefix)),
      getLabelText(labels.getLabel('or')),
      getLabelLink('quarter-select', null, labels.getLabel('filter_a_quarter', labelPrefix)),
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
