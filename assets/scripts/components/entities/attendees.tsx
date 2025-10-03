import React from 'react';

import AffiliatedPeopleTable from '../affiliated-people-table';
import AffiliatedRecordsGroup from '../affiliated-records-group';

import useLimitedQuery from '../../hooks/use-limited-query';

import api from '../../services/api';

import type { Entity } from '../../types';

interface Props {
  entity: Entity;
}

const Attendees = ({ entity }: Props) => {
  const query = api.useLazyGetEntityAttendeesByIdQuery;

  const { initialLimit, setRecordLimit } = useLimitedQuery(query, {
    id: entity.id,
    limit: 5,
  });

  const hasEntity = Boolean(entity);
  const hasAttendees = hasEntity && 'attendees' in entity && Boolean(entity.attendees);

  if (!hasAttendees) return null;

  return (
    <AffiliatedRecordsGroup
      group={entity.attendees}
      notFoundLabel='No record of associated names was found.'
    >
      {entity.attendees.values.map(group => (
        <AffiliatedPeopleTable
          key={group.role}
          attendees={group}
          initialCount={initialLimit}
          model={entity.attendees.model}
          setLimit={setRecordLimit}
        />
      ))}
    </AffiliatedRecordsGroup>
  );
};

export default Attendees;
