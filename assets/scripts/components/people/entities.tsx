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
  const isLobbist = person.roles?.includes(Role.Lobbyist);
  const isOfficial = person.roles?.includes(Role.Official);

  useEffect(() => {
    if (!hasEntities || !fetched.current) {
      const { pathname } = location;

      fetchFromPath(pathname + '/entities');
      fetched.current = true;
    }
  }, [fetched, hasEntities, location]);

  return (
    <IncidentActivityGroups
      title='Associated Entities'
      description={`${person.name} is named in lobbying reports related to these entities.`}
    >
      {entities ? (
        <>
          {isLobbist && (
            <IncidentActivityGroup
              icon='briefcase'
              title={`As a lobbyist, ${person.name} interacted with City officials on behalf of these entities`}
            >
              <AffiliatedEntitiesTable person={person} entities={entities.asLobbyist} />
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
      ) : null}
    </IncidentActivityGroups>
  );
};

export default Entities;
