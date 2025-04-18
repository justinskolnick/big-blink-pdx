const {
  MODEL_ENTITIES,
  MODEL_PEOPLE,
  PARAM_DATE_ON,
  PARAM_DATE_RANGE_FROM,
  PARAM_DATE_RANGE_TO,
  PARAM_WITH_ENTITY_ID,
  PARAM_WITH_PERSON_ID,
} = require('../config/constants');
const { DATE_PATTERN } = require('../config/patterns');

const dateHelper = require('./date');

const hasDate = (param) => param?.length > 0 && DATE_PATTERN.test(param);
const hasInteger = (param) => param?.length > 0 && Number.isInteger(Number(param));

const getLabel = value => ({
  type: 'label',
  value,
});
const getLabelText = value => ({
  type: 'text',
  value,
});
const getLabelLink = (to, value) => ({
  to,
  type: 'link',
  value,
});
const getLabelId = value => ({
  type: 'id',
  value: Number(value),
});

const getDateOnFilter = searchParams => ({
  labels: [
    getLabelText('on'),
    getLabel(dateHelper.formatDateString(searchParams.get(PARAM_DATE_ON))),
  ],
  values: {
    [PARAM_DATE_ON]: searchParams.get(PARAM_DATE_ON),
  },
});

const getDateRangeFilter = searchParams => ({
  labels: [
    getLabelText('between'),
    getLabel(dateHelper.formatDateString(searchParams.get(PARAM_DATE_RANGE_FROM))),
    getLabelText('and'),
    getLabel(dateHelper.formatDateString(searchParams.get(PARAM_DATE_RANGE_TO))),
  ],
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
    labels: [
      getLabelLink('date-select', 'on a date'),
      getLabelText('or'),
      getLabelLink('date-range-select', 'between dates'),
    ],
  };
};

const getEntitiesFilter = searchParams => {
  if (searchParams.has(PARAM_WITH_ENTITY_ID)) {
    if (hasInteger(searchParams.get(PARAM_WITH_ENTITY_ID))) {
      return {
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

module.exports = {
  getDatesFilter,
  getEntitiesFilter,
  getPeopleFilter,
};
