const LANG_EN = 'en';
const LOCALE = 'en-US';

const ASSOCIATION_ENTITIES = 'entities';
const ASSOCIATION_LOBBYISTS = 'lobbyists';
const ASSOCIATION_OFFICIALS = 'officials';

const COLLECTION_ATTENDEES = 'attendees';
const COLLECTION_ENTITIES = 'entities';

const PARAM_ASSOCIATION = 'association';
const PARAM_DATE_ON = 'date_on';
const PARAM_DATE_RANGE_FROM = 'date_range_from';
const PARAM_DATE_RANGE_TO = 'date_range_to';
const PARAM_LIMIT = 'limit';
const PARAM_PAGE = 'page';
const PARAM_PEOPLE = 'people';
const PARAM_QUARTER = 'quarter';
const PARAM_QUARTER_ALT = 'quarter';
const PARAM_ROLE = 'role';
const PARAM_SORT = 'sort';
const PARAM_SORT_BY = 'sort_by';
const PARAM_WITH_ENTITY_ID = 'with_entity_id';
const PARAM_WITH_PERSON_ID = 'with_person_id';
const PARAM_YEAR = 'year';

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

const ROLE_ENTITY = 'entity';
const ROLE_LOBBYIST = 'lobbyist';
const ROLE_OFFICIAL = 'official';
const ROLE_SOURCE = 'source';

const SECTION_ENTITIES = 'entities';
const SECTION_INCIDENTS = 'incidents';
const SECTION_PEOPLE = 'people';
const SECTION_SOURCES = 'sources';

const TIME_ZONE = 'America/Los_Angeles';

module.exports = {
  ASSOCIATION_ENTITIES,
  ASSOCIATION_LOBBYISTS,
  ASSOCIATION_OFFICIALS,
  COLLECTION_ATTENDEES,
  COLLECTION_ENTITIES,
  LANG_EN,
  LOCALE,
  MODEL_ENTITIES,
  MODEL_PEOPLE,
  PARAM_ASSOCIATION,
  PARAM_DATE_ON,
  PARAM_DATE_RANGE_FROM,
  PARAM_DATE_RANGE_TO,
  PARAM_LIMIT,
  PARAM_PAGE,
  PARAM_PEOPLE,
  PARAM_QUARTER,
  PARAM_QUARTER_ALT,
  PARAM_ROLE,
  PARAM_SORT,
  PARAM_SORT_BY,
  PARAM_WITH_ENTITY_ID,
  PARAM_WITH_PERSON_ID,
  PARAM_YEAR,
  QUARTERS,
  ROLE_ENTITY,
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
  ROLE_SOURCE,
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
