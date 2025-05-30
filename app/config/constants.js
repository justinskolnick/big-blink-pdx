const LOCALE = 'en-US';

const PARAM_DATE_ON = 'date_on';
const PARAM_DATE_RANGE_FROM = 'date_range_from';
const PARAM_DATE_RANGE_TO = 'date_range_to';
const PARAM_PAGE = 'page';
const PARAM_QUARTER = 'quarter';
const PARAM_SORT = 'sort';
const PARAM_SORT_BY = 'sort_by';
const PARAM_WITH_ENTITY_ID = 'with_entity_id';
const PARAM_WITH_PERSON_ID = 'with_person_id';
const PARAM_YEAR = 'year';

const PARAM_OPTIONS = {
  [PARAM_DATE_ON]: {
    validate: 'hasDate',
  },
  [PARAM_DATE_RANGE_FROM]: {
    validate: 'hasDate',
  },
  [PARAM_DATE_RANGE_TO]: {
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
  [PARAM_YEAR]: {
    validate: 'hasYear',
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

const MODEL_ENTITIES = 'entities';
const MODEL_PEOPLE = 'people';

const ROLE_LOBBYIST = 'lobbyist';
const ROLE_OFFICIAL = 'official';

const SECTION_ENTITIES = 'entities';
const SECTION_INCIDENTS = 'incidents';
const SECTION_PEOPLE = 'people';
const SECTION_SOURCES = 'sources';

const TIME_ZONE = 'America/Los_Angeles';

module.exports = {
  LOCALE,
  MODEL_ENTITIES,
  MODEL_PEOPLE,
  PARAM_DATE_ON,
  PARAM_DATE_RANGE_FROM,
  PARAM_DATE_RANGE_TO,
  PARAM_OPTIONS,
  PARAM_PAGE,
  PARAM_QUARTER,
  PARAM_SORT,
  PARAM_SORT_BY,
  PARAM_WITH_ENTITY_ID,
  PARAM_WITH_PERSON_ID,
  QUARTERS,
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
  SECTION_ENTITIES,
  SECTION_INCIDENTS,
  SECTION_PEOPLE,
  SECTION_SOURCES,
  SORT_ASC,
  SORT_BY_NAME,
  SORT_BY_OPTIONS,
  SORT_BY_TOTAL,
  SORT_DESC,
  SORT_OPTIONS,
  TIME_ZONE,
};
