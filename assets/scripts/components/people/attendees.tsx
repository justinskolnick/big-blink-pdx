import React from 'react';

import AffiliatedPeopleTable from '../affiliated-people-table';
import IncidentActivityGroups from '../incident-activity-groups';
import IncidentActivityGroup from '../incident-activity-group';
import { iconName } from '../people/icon';

import useLimitedQuery from '../../hooks/use-limited-query';

import api from '../../services/api';

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
  const query = api.useLazyGetPersonAttendeesByIdQuery;

  const { initialLimit, setRecordLimit } = useLimitedQuery(query, {
    id: person.id,
    limit: 5,
  });

  const hasAttendees = 'attendees' in person && Boolean(person.attendees);
  const isLobbyist = person.roles?.includes(Role.Lobbyist);
  const isOfficial = person.roles?.includes(Role.Official);
  const hasRecords = hasAttendees && attendees.roles.some(role => role.values.some(v => v.records.length));

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

  return (
    <IncidentActivityGroups
      title='Associated Names'
      description={`${person.name} is named in lobbying reports that also include these people.`}
      icon={iconName}
    >
      {hasRecords ? (
        attendees.roles.map(role => (
          <IncidentActivityGroup key={role.role} group={role}>
            {role.values.map(group => (
              <AffiliatedPeopleTable
                key={group.role}
                attendees={group}
                initialCount={initialLimit}
                model={role.model}
                setLimit={setRecordLimit}
              />
            ))}
          </IncidentActivityGroup>
        ))
      ) : (
        <IncidentActivityGroup
          title='No record of associated names was found.'
        />
      )}
    </IncidentActivityGroups>
  );
};

export default Attendees;
