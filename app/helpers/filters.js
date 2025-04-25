const {
  MODEL_ENTITIES,
  MODEL_PEOPLE,
  PARAM_DATE_ON,
  PARAM_DATE_RANGE_FROM,
  PARAM_DATE_RANGE_TO,
  PARAM_QUARTER,
  PARAM_WITH_ENTITY_ID,
  PARAM_WITH_PERSON_ID,
} = require('../config/constants');
const { DATE_PATTERN, QUARTER_PATTERN } = require('../config/patterns');

const dateHelper = require('./date');

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

const getLabel = value => ({
  type: 'label',
  value,
});
const getLabelText = value => ({
  type: 'text',
  value,
});
const getLabelLink = (action, to, value) => ({
  action,
  to,
  type: 'link',
  value,
});
const getLabelId = value => ({
  type: 'id',
  value: Number(value),
});

const getDateOnFilter = searchParams => ({
  fields: null,
  labels: [
    getLabelText('on'),
    getLabel(dateHelper.formatDateString(searchParams.get(PARAM_DATE_ON))),
  ],
  model: null,
  values: {
    [PARAM_DATE_ON]: searchParams.get(PARAM_DATE_ON),
  },
});

const getDateRangeFilter = searchParams => ({
  fields: null,
  labels: [
    getLabelText('between'),
    getLabel(dateHelper.formatDateString(searchParams.get(PARAM_DATE_RANGE_FROM))),
    getLabelText('and'),
    getLabel(dateHelper.formatDateString(searchParams.get(PARAM_DATE_RANGE_TO))),
  ],
  model: null,
  values: {
    [PARAM_DATE_RANGE_FROM]: searchParams.get(PARAM_DATE_RANGE_FROM),
    [PARAM_DATE_RANGE_TO]: searchParams.get(PARAM_DATE_RANGE_TO),
  },
});

const getDatesFilter = searchParams => {
  const hasDateOn = searchParams.has(PARAM_DATE_ON) && hasDate(searchParams.get(PARAM_DATE_ON));
  const hasDateRange = [PARAM_DATE_RANGE_FROM, PARAM_DATE_RANGE_TO].every(p => searchParams.has(p) && hasDate(searchParams.get(p)));

  if (hasDateOn) {
    return getDateOnFilter(searchParams);
  } else if (hasDateRange) {
    return getDateRangeFilter(searchParams);
  }

  return {
    fields: {
      'date-select': [
        getLabelText('on'),
        {
          name: PARAM_DATE_ON,
          type: 'input-date',
        },
      ],
      'date-range-select': [
        getLabelText('between'),
        {
          name: PARAM_DATE_RANGE_FROM,
          type: 'input-date',
        },
        getLabelText('and'),
        {
          name: PARAM_DATE_RANGE_TO,
          type: 'input-date',
        },
      ],
    },
    labels: [
      getLabelLink('date-select', null, 'on a date'),
      getLabelText('or'),
      getLabelLink('date-range-select', null, 'between dates'),
    ],
    model: null,
  };
};

const getEntitiesFilter = searchParams => {
  if (searchParams.has(PARAM_WITH_ENTITY_ID)) {
    if (hasInteger(searchParams.get(PARAM_WITH_ENTITY_ID))) {
      return {
        fields: null,
        labels: [
          getLabelText('and'),
          getLabelId(searchParams.get(PARAM_WITH_ENTITY_ID)),
        ],
        model: MODEL_ENTITIES,
        values: {
          [PARAM_WITH_ENTITY_ID]: Number(searchParams.get(PARAM_WITH_ENTITY_ID)),
        },
      };
    }
  }
};

const getPeopleFilter = searchParams => {
  if (searchParams.has(PARAM_WITH_PERSON_ID)) {
    if (hasInteger(searchParams.get(PARAM_WITH_PERSON_ID))) {
      return {
        fields: null,
        labels: [
          getLabelText('and'),
          getLabelId(searchParams.get(PARAM_WITH_PERSON_ID)),
        ],
        model: MODEL_PEOPLE,
        values: {
          [PARAM_WITH_PERSON_ID]: Number(searchParams.get(PARAM_WITH_PERSON_ID)),
        },
      };
    }
  }
};

const getQuarterFilter = searchParams => {
  if (searchParams.has(PARAM_QUARTER)) {
    if (hasQuarterAndYear(searchParams.get(PARAM_QUARTER))) {
      const parts = getQuarterAndYear(searchParams.get(PARAM_QUARTER));

      return {
        fields: null,
        labels: [
          getLabelText('during'),
          getLabel(`Q${parts.at(0)}`),
          getLabelText('of'),
          getLabel(parts.at(1)),
        ],
        model: null,
        values: {
          [PARAM_QUARTER]: searchParams.get(PARAM_QUARTER),
        },
      };
    }
  }
};

module.exports = {
  getDatesFilter,
  getEntitiesFilter,
  getPeopleFilter,
  getQuarterFilter,
};
