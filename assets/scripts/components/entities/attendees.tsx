import React from 'react';

import AffiliatedPeopleTable from '../affiliated-people-table';
import IncidentActivityGroups from '../incident-activity-groups';
import IncidentActivityGroup from '../incident-activity-group';
import { iconName } from '../people/icon';

import useLimitedQuery from '../../hooks/use-limited-query';

import api from '../../services/api';

import type { Attendees as AttendeesType, Entity } from '../../types';

interface Props {
  attendees: AttendeesType;
  entity: Entity;
}

const Attendees = ({
  attendees,
  entity,
}: Props) => {
  const query = api.useLazyGetEntityAttendeesByIdQuery;

  const { initialLimit, setRecordLimit } = useLimitedQuery(query, {
    id: entity.id,
    limit: 5,
  });

  const hasAttendees = 'attendees' in entity && Boolean(entity.attendees);

  return (
    <IncidentActivityGroups
      title='Associated Names'
      description={`These people appear in lobbying reports related to ${entity.name}${entity.name.endsWith('.') ? '' : '.'}`}
      icon={iconName}
    >
      {hasAttendees ? (
        <IncidentActivityGroup group={attendees}>
          {attendees.values.map(group => (
            <AffiliatedPeopleTable
              key={group.role}
              attendees={group}
              initialCount={initialLimit}
              model={attendees.model}
              setLimit={setRecordLimit}
            />
          ))}
        </IncidentActivityGroup>
      ) : null}
    </IncidentActivityGroups>
  );
};

export default Attendees;
