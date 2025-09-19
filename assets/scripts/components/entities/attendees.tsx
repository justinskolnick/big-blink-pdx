import React, { useEffect } from 'react';

import AffiliatedPeopleTable from '../affiliated-people-table';
import IncidentActivityGroups from '../incident-activity-groups';
import IncidentActivityGroup from '../incident-activity-group';
import { iconName } from '../people/icon';

import useSetLimit from '../../hooks/use-set-limit';

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
  const { initialLimit, recordLimit, setRecordLimit } = useSetLimit(5);

  const [trigger] = api.useLazyGetEntityAttendeesByIdQuery();

  const hasAttendees = 'attendees' in entity && Boolean(entity.attendees);

  useEffect(() => {
    trigger({ id: entity.id, limit: recordLimit });
  }, [
    entity,
    recordLimit,
    trigger,
  ]);

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
