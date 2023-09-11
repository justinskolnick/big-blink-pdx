import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import fetchFromPath from '../../lib/fetch-from-path';

import AffiliatedPeopleTable from '../affiliated-people-table';
import IncidentActivityGroups from '../incident-activity-groups';
import IncidentActivityGroup from '../incident-activity-group';
import ItemTextWithIcon from '../item-text-with-icon';

import type { Attendees as AttendeesType, Entity } from '../../types';

interface Props {
  attendees: AttendeesType;
  entity: Entity;
}

const Attendees = ({
  attendees,
  entity,
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
    <IncidentActivityGroups
      title='Associated Names'
      description={`These people appear in lobbying reports related to ${entity.name}${entity.name.endsWith('.') ? '' : '.'}`}
    >
      {attendees ? (
        <IncidentActivityGroup title={
          <ItemTextWithIcon icon='building'>
            As an entity, {entity.name} ...
          </ItemTextWithIcon>
        }>
          <AffiliatedPeopleTable
            people={attendees.officials}
            title='Lobbied these City officials:'
          />
          <AffiliatedPeopleTable
            people={attendees.lobbyists}
            title='Through these lobbyists:'
          />
        </IncidentActivityGroup>
      ) : null}
    </IncidentActivityGroups>
  );
};

export default Attendees;
