import React, { useEffect } from 'react';

import AffiliatedPeopleTable from '../affiliated-people-table';
import IncidentActivityGroups from '../incident-activity-groups';
import IncidentActivityGroup from '../incident-activity-group';

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
  const [trigger] = api.useLazyGetEntityAttendeesByIdQuery();

  const hasAttendees = 'attendees' in entity;

  useEffect(() => {
    if (!hasAttendees) {
      trigger({ id: entity.id });
    }
  }, [entity, hasAttendees, trigger]);

  return (
    <IncidentActivityGroups
      title='Associated Names'
      description={`These people appear in lobbying reports related to ${entity.name}${entity.name.endsWith('.') ? '' : '.'}`}
    >
      {attendees ? (
        <IncidentActivityGroup
          icon='building'
          title={attendees.label}
        >
          <AffiliatedPeopleTable attendees={attendees.officials} />
          <AffiliatedPeopleTable attendees={attendees.lobbyists} />
        </IncidentActivityGroup>
      ) : null}
    </IncidentActivityGroups>
  );
};

export default Attendees;
