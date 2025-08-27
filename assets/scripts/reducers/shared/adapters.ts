import type {
  Attendee,
  Attendees,
  Incident,
  Incidented,
} from '../../types';

export const adaptAttendeeRecords = (records: Attendee[]) =>
  records.map(record => ({
    ...record,
    person: {
      id: record.person.id,
    },
  }));

export const adaptAttendees = (attendees: Attendees) => ({
  ...attendees,
  values: attendees.values.map(value => ({
    ...value,
    records: adaptAttendeeRecords(value.records),
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
