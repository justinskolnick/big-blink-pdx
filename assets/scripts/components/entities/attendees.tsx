import React from 'react';

import AffiliatedPeopleTable from '../affiliated-people-table';
import IncidentActivityGroups from '../incident-activity-groups';
import AffiliatedRecordsGroup from '../affiliated-records-group';
import { iconName } from '../people/icon';

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
    <IncidentActivityGroups
      title='Associated Names'
      description={`These people appear in lobbying reports related to ${entity.name}${entity.name.endsWith('.') ? '' : '.'}`}
      icon={iconName}
    >
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
    </IncidentActivityGroups>
  );
};

export default Attendees;
