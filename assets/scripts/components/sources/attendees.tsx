import React from 'react';
import { useParams } from 'react-router';

import AffiliatedPeopleTable from '../affiliated-people-table';
import IncidentActivityGroups from '../incident-activity-groups';
import IncidentActivityGroup from '../incident-activity-group';
import { iconName } from '../people/icon';

import useLimitedQuery from '../../hooks/use-limited-query';

import api from '../../services/api';

import type { Attendees as AttendeesType } from '../../types';

interface Props {
  attendees: AttendeesType;
}

const Attendees = ({ attendees }: Props) => {
  const params = useParams();
  const id = Number(params.id);

  const query = api.useLazyGetSourceAttendeesByIdQuery;

  const { initialLimit, setRecordLimit } = useLimitedQuery(query, {
    id,
    limit: 5,
  });

  const hasAttendees = Boolean(attendees);

  return (
    <IncidentActivityGroups title='Associated Names' icon={iconName}>
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
