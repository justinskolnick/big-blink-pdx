import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import fetchFromPath from '../../lib/fetch-from-path';

import AffiliatedEntitiesTable from '../affiliated-entities-table';
import IncidentActivityGroups from '../incident-activity-groups';
import IncidentActivityGroup from '../incident-activity-group';
import ItemTextWithIcon from '../item-text-with-icon';

import type { Person, PersonEntities } from '../../types';
import { Role } from '../../types';

interface Props {
  entities: PersonEntities;
  person: Person;
}

const Entities = ({ entities, person }: Props) => {
  const fetched = useRef(false);
  const location = useLocation();

  const isLobbist = person.roles?.includes(Role.Lobbyist);
  const isOfficial = person.roles?.includes(Role.Official);

  useEffect(() => {
    if (!fetched.current) {
      const { pathname } = location;

      fetchFromPath(pathname + '/entities');
      fetched.current = true;
    }
  }, [fetched, location]);

  return (
    <IncidentActivityGroups
      title='Associated Entities'
      description={`${person.name} is named in lobbying reports related to these entities.`}
    >
      {entities ? (
        <>
          {isLobbist && (
            <IncidentActivityGroup title={
              <ItemTextWithIcon icon='briefcase'>
                As a lobbyist, {person.name} interacted with City officials on behalf of these entities:
              </ItemTextWithIcon>
            }>
              <AffiliatedEntitiesTable entities={entities.asLobbyist} />
            </IncidentActivityGroup>
          )}
          {isOfficial && (
            <IncidentActivityGroup title={
              <ItemTextWithIcon icon='landmark'>
                As a City official, {person.name} was lobbied by representatives of these entities:
              </ItemTextWithIcon>
            }>
              <AffiliatedEntitiesTable entities={entities.asOfficial} />
            </IncidentActivityGroup>
          )}
        </>
      ) : null}
    </IncidentActivityGroups>
  );
};

export default Entities;
