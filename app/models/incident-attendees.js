const TABLE = 'incident_attendees';
const FIELDS = [
  'id',
  // 'incident_id',
  // 'person_id',
  'appears_as',
  'role',
];
const PER_PAGE = 20;

const LOBBYIST_ROLE = 'lobbyist';
const OFFICIAL_ROLE = 'official';

const adaptJoinedResult = data => ({
  id: data.id,
  as: data.appears_as,
  person: {
    id: data.person_id,
    name: data.name,
    type: data.type,
  },
});

module.exports = {
  TABLE,
  FIELDS,
  PER_PAGE,
  LOBBYIST_ROLE,
  OFFICIAL_ROLE,
  adaptJoinedResult,
};
