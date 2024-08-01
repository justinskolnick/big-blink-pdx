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

  const hasAttendees = 'attendees' in person;
  const isLobbyist = person.roles?.includes(Role.Lobbyist);
  const isOfficial = person.roles?.includes(Role.Official);
  const hasLobbyistRecords = isLobbyist && hasAttendees && Boolean(person.attendees.asLobbyist.lobbyists.records.length || person.attendees.asLobbyist.officials.records.length);
  const hasOfficialRecords = isOfficial && hasAttendees && Boolean(person.attendees.asOfficial.lobbyists.records.length || person.attendees.asOfficial.officials.records.length);
  const hasRecords = hasLobbyistRecords || hasOfficialRecords;

  const description = [
    'According to the lobbying activity reports published by the City of Portland,',
    person.name,
  ];
  const roles = [];

  if (isLobbyist) {
    roles.push('lobbied a number of City officials as a registered lobbyist');
  }
  if (isOfficial) {
    roles.push('was lobbied by a number of lobbyists as a City of Portland official');
  }

  description.push(roles.join(' and '));

  useEffect(() => {
    if (!hasRecords || !fetched.current) {
      const { pathname } = location;

      fetchFromPath(pathname + '/attendees');
      fetched.current = true;
    }
  }, [fetched, hasRecords, location]);

  return (
    <IncidentActivityGroups
      title='Associated Names'
      description={`${person.name} is named in lobbying reports that also include these people.`}
    >
      {hasRecords ? (
        <>
          {isLobbyist && (
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
      ) : (
        <IncidentActivityGroup
          title='No record of associated names was found.'
        />
      )}
    </IncidentActivityGroups>
  );
};

export default Attendees;
