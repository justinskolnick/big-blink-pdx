import React from 'react';

import AffiliatedPeopleTable from '../affiliated-people-table';
import AffiliatedRecordsGroup from '../affiliated-records-group';

import useLimitedQuery from '../../hooks/use-limited-query';

import api from '../../services/api';

import type { Person } from '../../types';

interface Props {
  person: Person;
}

const Attendees = ({ person }: Props) => {
  const query = api.useLazyGetPersonAttendeesByIdQuery;

  const { initialLimit, setRecordLimit } = useLimitedQuery(query, {
    id: person.id,
    limit: 5,
  });

  const hasPerson = Boolean(person);
  const hasAttendees = hasPerson && 'attendees' in person && Boolean(person.attendees);

  if (!hasAttendees) return null;

  return person.attendees.roles.map(role => (
    <AffiliatedRecordsGroup
      key={role.role}
      notFoundLabel='No record of associated names was found.'
      group={role}
    >
      {role.values.map((group, i: number) => (
        <AffiliatedPeopleTable
          key={i}
          attendees={group}
          initialCount={initialLimit}
          model={role.model}
          setLimit={setRecordLimit}
        />
      ))}
    </AffiliatedRecordsGroup>
  ));
};

export default Attendees;
