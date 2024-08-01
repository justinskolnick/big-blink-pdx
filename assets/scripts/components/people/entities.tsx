import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import fetchFromPath from '../../lib/fetch-from-path';

import AffiliatedEntitiesTable from '../affiliated-entities-table';
import IncidentActivityGroups from '../incident-activity-groups';
import IncidentActivityGroup from '../incident-activity-group';

import type { Person, PersonEntities } from '../../types';
import { Role } from '../../types';

interface Props {
  entities: PersonEntities;
  person: Person;
}

const Entities = ({ entities, person }: Props) => {
  const fetched = useRef(false);
  const location = useLocation();

  const hasEntities = 'entities' in person;
  const isLobbyist = person.roles?.includes(Role.Lobbyist);
  const isOfficial = person.roles?.includes(Role.Official);
  const hasLobbyistRecords = isLobbyist && hasEntities && Boolean(person.entities.asLobbyist.length || person.entities.asLobbyist.length);
  const hasOfficialRecords = isOfficial && hasEntities && Boolean(person.entities.asOfficial.length || person.entities.asOfficial.length);
  const hasRecords = hasLobbyistRecords || hasOfficialRecords;

  useEffect(() => {
    if (!hasRecords || !fetched.current) {
      const { pathname } = location;

      fetchFromPath(pathname + '/entities');
      fetched.current = true;
    }
  }, [fetched, hasRecords, location]);

  return (
    <IncidentActivityGroups
      title='Associated Entities'
      description={`${person.name} is named in lobbying reports related to these entities.`}
    >
      {hasRecords ? (
        <>
          {isLobbyist && (
            <IncidentActivityGroup
              icon='briefcase'
              title={`As a lobbyist, ${person.name} interacted with City officials on behalf of these entities`}
            >
              <AffiliatedEntitiesTable
                entities={entities.asLobbyist}
                hasLobbyist
                person={person}
              />
            </IncidentActivityGroup>
          )}
          {isOfficial && (
            <IncidentActivityGroup
              icon='landmark'
              title={`As a City official, ${person.name} was lobbied by representatives of these entities`}
            >
              <AffiliatedEntitiesTable entities={entities.asOfficial} />
            </IncidentActivityGroup>
          )}
        </>
      ) : (
        <IncidentActivityGroup
          title='No record of associated entities was found.'
        />
      )}
    </IncidentActivityGroups>
  );
};

export default Entities;
