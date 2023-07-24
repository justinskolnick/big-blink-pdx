import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import fetchFromPath from '../../lib/fetch-from-path';

import AffiliatedItemTable from '../affiliated-item-table';
import IncidentActivityGroups from '../incident-activity-groups';
import IncidentActivityGroup from '../incident-activity-group';
import ItemTextWithIcon from '../item-text-with-icon';
import {
  getWithPersonParams,
  FilterLink,
  LinkToPerson,
} from '../links';
import StatBox from '../stat-box';

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
              <StatBox title='Lobbied these City officials:'>
                <AffiliatedItemTable
                  affiliatedItems={attendees.asLobbyist.officials}
                  label='people'
                  TitleCell={({ item }) => (
                    <LinkToPerson id={item.person.id}>
                      {item.person.name}
                    </LinkToPerson>
                  )}
                  TotalCell={({ item }) => (
                    <FilterLink newParams={getWithPersonParams(item)} hasIcon>
                      {item.total}
                    </FilterLink>
                  )}
                />
              </StatBox>

              <StatBox title='Alongside these lobbyists:'>
                <AffiliatedItemTable
                  affiliatedItems={attendees.asLobbyist.lobbyists}
                  label='people'
                  TitleCell={({ item }) => (
                    <LinkToPerson id={item.person.id}>
                      {item.person.name}
                    </LinkToPerson>
                  )}
                  TotalCell={({ item }) => (
                    <FilterLink newParams={getWithPersonParams(item)} hasIcon>
                      {item.total}
                    </FilterLink>
                  )}
                />
              </StatBox>
            </IncidentActivityGroup>
          )}
          {isOfficial && (
            <IncidentActivityGroup title={
              <ItemTextWithIcon icon='landmark'>
                As a City official, {person.name} ...
              </ItemTextWithIcon>
            }>
              <StatBox title='Was lobbied by these lobbyists:'>
                <AffiliatedItemTable
                  affiliatedItems={attendees.asOfficial.lobbyists}
                  label='people'
                  TitleCell={({ item }) => (
                    <LinkToPerson id={item.person.id}>
                      {item.person.name}
                    </LinkToPerson>
                  )}
                  TotalCell={({ item }) => (
                    <FilterLink newParams={getWithPersonParams(item)} hasIcon>
                      {item.total}
                    </FilterLink>
                  )}
                />
              </StatBox>

              <StatBox title='Alongside these City officials:'>
                <AffiliatedItemTable
                  affiliatedItems={attendees.asOfficial.officials}
                  label='people'
                  TitleCell={({ item }) => (
                    <LinkToPerson id={item.person.id}>
                      {item.person.name}
                    </LinkToPerson>
                  )}
                  TotalCell={({ item }) => (
                    <FilterLink newParams={getWithPersonParams(item)} hasIcon>
                      {item.total}
                    </FilterLink>
                  )}
                />
              </StatBox>
            </IncidentActivityGroup>
          )}
        </>
      ) : null}
    </IncidentActivityGroups>
  );
};

export default Attendees;
