import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import AffiliatedPeopleTable from '../affiliated-people-table';
import IncidentActivityGroups from '../incident-activity-groups';
import IncidentActivityGroup from '../incident-activity-group';

import api from '../../services/api';

import type { Attendees as AttendeesType } from '../../types';

interface Props {
  attendees: AttendeesType;
}

const Attendees = ({ attendees }: Props) => {
  const [trigger] = api.useLazyGetSourceAttendeesByIdQuery();

  const { id } = useParams();
  const numericId = Number(id);

  const hasAttendees = Boolean(attendees);

  useEffect(() => {
    if (!hasAttendees) {
      trigger(numericId);
    }
  }, [hasAttendees, numericId, trigger]);

  return (
    <IncidentActivityGroups title='Associated Names'>
      {attendees ? (
        <IncidentActivityGroup
          icon='user-group'
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
