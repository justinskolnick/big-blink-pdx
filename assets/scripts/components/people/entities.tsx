import React, { useEffect } from 'react';

import AffiliatedEntitiesTable from '../affiliated-entities-table';
import IncidentActivityGroups from '../incident-activity-groups';
import IncidentActivityGroup from '../incident-activity-group';
import { iconName } from '../entities/icon';

import api from '../../services/api';

import type { Person, PersonEntities } from '../../types';
import { Role } from '../../types';

interface Props {
  entities: PersonEntities;
  person: Person;
}

const Entities = ({ entities, person }: Props) => {
  const [trigger] = api.useLazyGetPersonEntitiesByIdQuery();

  const hasEntities = 'entities' in person && Boolean(person.entities);
  const hasRecords = hasEntities && entities.roles.some(role => role.values.some(v => v.records.length));

  useEffect(() => {
    if (!hasRecords) {
      trigger({ id: person.id });
    }
  }, [hasRecords, person, trigger]);

  return (
    <IncidentActivityGroups
      title='Associated Entities'
      description={`${person.name} is named in lobbying reports related to these entities.`}
      icon={iconName}
    >
      {hasRecords ? (
        entities.roles.map(role => (
          <IncidentActivityGroup key={role.role} group={role}>
            {role.values.map(group => (
              <AffiliatedEntitiesTable
                key={group.role}
                entities={group}
                hasLobbyist={group.role === Role.Lobbyist}
                person={person}
              />
            ))}
          </IncidentActivityGroup>
        ))
      ) : (
        <IncidentActivityGroup
          title='No record of associated entities was found.'
        />
      )}
    </IncidentActivityGroups>
  );
};

export default Entities;
