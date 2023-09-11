import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import fetchFromPath from '../../lib/fetch-from-path';

import AffiliatedPeopleTable from '../affiliated-people-table';
import IncidentActivityGroups from '../incident-activity-groups';
import IncidentActivityGroup from '../incident-activity-group';
import ItemTextWithIcon from '../item-text-with-icon';

import type { Person, PersonAttendees } from '../../types';
import { Role } from '../../types';

interface Props {
  attendees: PersonAttendees;
  person: Person;
}

const Attendees = ({
  attendees,
  person,
}: Props) => {
  const fetched = useRef(false);
  const location = useLocation();

  const isLobbist = person.roles?.includes(Role.Lobbyist);
  const isOfficial = person.roles?.includes(Role.Official);

  const description = [
    'According to the lobbying activity reports published by the City of Portland,',
    person.name,
  ];
  const roles = [];

  if (isLobbist) {
    roles.push('lobbied a number of City officials as a registered lobbyist');
  }
  if (isOfficial) {
    roles.push('was lobbied by a number of lobbyists as a City of Portland official');
  }

  description.push(roles.join(' and '));

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
      description={`${person.name} is named in lobbying reports that also include these people.`}
    >
      {attendees ? (
        <>
          {isLobbist && (
            <IncidentActivityGroup title={
              <ItemTextWithIcon icon='briefcase'>
                As a lobbyist, {person.name} ...
              </ItemTextWithIcon>
            }>
              <AffiliatedPeopleTable
                people={attendees.asLobbyist.officials}
                title='Lobbied these City officials:'
              />
              <AffiliatedPeopleTable
                people={attendees.asLobbyist.lobbyists}
                title='Alongside these lobbyists:'
              />
            </IncidentActivityGroup>
          )}
          {isOfficial && (
            <IncidentActivityGroup title={
              <ItemTextWithIcon icon='landmark'>
                As a City official, {person.name} ...
              </ItemTextWithIcon>
            }>
              <AffiliatedPeopleTable
                people={attendees.asOfficial.lobbyists}
                title='Was lobbied by these lobbyists:'
              />
              <AffiliatedPeopleTable
                people={attendees.asOfficial.officials}
                title='Alongside these City officials:'
              />
            </IncidentActivityGroup>
          )}
        </>
      ) : null}
    </IncidentActivityGroups>
  );
};

export default Attendees;
