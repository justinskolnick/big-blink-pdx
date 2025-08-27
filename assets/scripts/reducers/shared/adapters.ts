import type {
  Attendees,
  Incident,
  Incidented,
} from '../../types';

export const adaptAttendees = (attendees: Attendees) => ({
  ...attendees,
  values: attendees.values.map(value => ({
    ...value,
    records: value.records.map(record => ({
      ...record,
      person: {
        id: record.person.id,
      },
    }))
  })),
} as Attendees);

export const adaptIncidents = (incidents: Incidented) => {
  const {
    filters,
    pagination,
    records,
    stats,
  } = incidents;
  const ids = records ? { ids: records.map((record: Incident) => record.id) } : undefined;

  return {
    filters,
    pagination,
    stats,
    ...ids,
  };
};
