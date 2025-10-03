import React from 'react';

import AffiliatedPeopleTable from '../affiliated-people-table';
import AffiliatedRecordsGroup from '../affiliated-records-group';

import useLimitedQuery from '../../hooks/use-limited-query';

import api from '../../services/api';

import type { Source } from '../../types';

interface Props {
  source: Source;
}

const Attendees = ({ source }: Props) => {
  const query = api.useLazyGetSourceAttendeesByIdQuery;

  const { initialLimit, setRecordLimit } = useLimitedQuery(query, {
    id: source.id,
    limit: 5,
  });

  const hasSource = Boolean(source);
  const hasAttendees = hasSource && 'attendees' in source && Boolean(source.attendees);

  if (!hasAttendees) return null;

  return (
    <AffiliatedRecordsGroup
      group={source.attendees}
      notFoundLabel='No record of associated names was found.'
    >
      {source.attendees.values.map(group => (
        <AffiliatedPeopleTable
          key={group.role}
          attendees={group}
          initialCount={initialLimit}
          model={source.attendees.model}
          setLimit={setRecordLimit}
        />
      ))}
    </AffiliatedRecordsGroup>
  );
};

export default Attendees;
