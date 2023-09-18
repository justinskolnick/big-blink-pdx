import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import fetchFromPath from '../../lib/fetch-from-path';

import AffiliatedPeopleTable from '../affiliated-people-table';
import IncidentActivityGroups from '../incident-activity-groups';
import IncidentActivityGroup from '../incident-activity-group';
import ItemTextWithIcon from '../item-text-with-icon';

import type { Attendees as AttendeesType, Source } from '../../types';

interface Props {
  attendees: AttendeesType;
  source: Source;
}

const Attendees = ({
  attendees,
  source,
}: Props) => {
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
        <IncidentActivityGroup title={
          <ItemTextWithIcon icon='user-group'>
            These people appear in {source.title}
          </ItemTextWithIcon>
        }>
          <AffiliatedPeopleTable
            people={attendees.officials}
            title='City Officials:'
          />
          <AffiliatedPeopleTable
            people={attendees.lobbyists}
            title='Lobbyists:'
          />
        </IncidentActivityGroup>
      ) : null}
    </IncidentActivityGroups>
  );
};

export default Attendees;
