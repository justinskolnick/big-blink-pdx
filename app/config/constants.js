const LOCALE = 'en-US';

const PARAM_DATE_ON = 'date_on';
const PARAM_PAGE = 'page';
const PARAM_QUARTER = 'quarter';
const PARAM_SORT = 'sort';
const PARAM_SORT_BY = 'sort_by';
const PARAM_WITH_ENTITY_ID = 'with_entity_id';
const PARAM_WITH_PERSON_ID = 'with_person_id';

const PARAM_OPTIONS = {
  [PARAM_DATE_ON]: {
    validate: 'hasDate',
  },
  [PARAM_PAGE]: {
    validate: 'hasInteger',
  },
  [PARAM_QUARTER]: {
    validate: 'hasQuarterAndYear',
  },
  [PARAM_SORT]: {
    validate: 'hasSort',
  },
  [PARAM_SORT_BY]: {
    validate: 'hasSortBy',
  },
  [PARAM_WITH_ENTITY_ID]: {
    validate: 'hasInteger',
  },
  [PARAM_WITH_PERSON_ID]: {
    validate: 'hasInteger',
  },
};

const QUARTERS = [1, 2, 3, 4];

const SORT_ASC = 'ASC';
const SORT_DESC = 'DESC';

const SORT_BY_NAME = 'name';
const SORT_BY_TOTAL = 'total';

const SORT_OPTIONS = {
  [SORT_ASC]: SORT_ASC,
  [SORT_DESC]: SORT_DESC,
};
const SORT_BY_OPTIONS = {
  [SORT_BY_NAME]: SORT_BY_NAME,
  [SORT_BY_TOTAL]: SORT_BY_TOTAL,
};

const TIME_ZONE = 'America/Los_Angeles';

module.exports = {
  LOCALE,
  PARAM_DATE_ON,
  PARAM_OPTIONS,
  PARAM_PAGE,
  PARAM_QUARTER,
  PARAM_SORT,
  PARAM_SORT_BY,
  PARAM_WITH_ENTITY_ID,
  PARAM_WITH_PERSON_ID,
  QUARTERS,
  SORT_ASC,
  SORT_BY_NAME,
  SORT_BY_OPTIONS,
  SORT_BY_TOTAL,
  SORT_DESC,
  SORT_OPTIONS,
  TIME_ZONE,
};
