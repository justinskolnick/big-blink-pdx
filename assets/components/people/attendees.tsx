import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import fetchFromPath from '../../lib/fetch-from-path';

import AffiliatedPeopleTable from '../affiliated-people-table';
import IncidentActivityGroups from '../incident-activity-groups';
import IncidentActivityGroup from '../incident-activity-group';

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
            <IncidentActivityGroup
              icon='briefcase'
              title={attendees.asLobbyist.label}
            >
              <AffiliatedPeopleTable attendees={attendees.asLobbyist.officials} />
              <AffiliatedPeopleTable attendees={attendees.asLobbyist.lobbyists} />
            </IncidentActivityGroup>
          )}
          {isOfficial && (
            <IncidentActivityGroup
              icon='landmark'
              title={attendees.asOfficial.label}
            >
              <AffiliatedPeopleTable attendees={attendees.asOfficial.lobbyists} />
              <AffiliatedPeopleTable attendees={attendees.asOfficial.officials} />
            </IncidentActivityGroup>
          )}
        </>
      ) : null}
    </IncidentActivityGroups>
  );
};

export default Attendees;
