import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import fetchFromPath from '../../lib/fetch-from-path';

import AffiliatedPeopleTable from '../affiliated-people-table';
import IncidentActivityGroups from '../incident-activity-groups';
import IncidentActivityGroup from '../incident-activity-group';

import type { Attendees as AttendeesType } from '../../types';

interface Props {
  attendees: AttendeesType;
}

const Attendees = ({ attendees }: Props) => {
  const fetched = useRef(false);
  const location = useLocation();

  useEffect(() => {
    if (!fetched.current) {
      const { pathname } = location;

      fetchFromPath(pathname + '/attendees');
      fetched.current = true;
    }
  }, [fetched, location]);

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
