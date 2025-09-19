import React, { useEffect } from 'react';
import { useParams } from 'react-router';

import AffiliatedPeopleTable from '../affiliated-people-table';
import IncidentActivityGroups from '../incident-activity-groups';
import IncidentActivityGroup from '../incident-activity-group';
import { iconName } from '../people/icon';

import useSetLimit from '../../hooks/use-set-limit';

import api from '../../services/api';

import type { Attendees as AttendeesType } from '../../types';

interface Props {
  attendees: AttendeesType;
}

const Attendees = ({ attendees }: Props) => {
  const { initialLimit, recordLimit, setRecordLimit } = useSetLimit(5);

  const [trigger] = api.useLazyGetSourceAttendeesByIdQuery();

  const { id } = useParams();
  const numericId = Number(id);

  const hasAttendees = Boolean(attendees);

  useEffect(() => {
    trigger({ id: numericId, limit: recordLimit });
  }, [
    numericId,
    recordLimit,
    trigger,
  ]);

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
