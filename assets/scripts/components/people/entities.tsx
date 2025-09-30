import React from 'react';

import AffiliatedEntitiesTable from '../affiliated-entities-table';
import IncidentActivityGroups from '../incident-activity-groups';
import AffiliatedRecordsGroup from '../affiliated-records-group';
import { iconName } from '../entities/icon';

import useLimitedQuery from '../../hooks/use-limited-query';

import api from '../../services/api';

import type { Person } from '../../types';
import { Role } from '../../types';

interface Props {
  person: Person;
}

const Entities = ({ person }: Props) => {
  const query = api.useLazyGetPersonEntitiesByIdQuery;

  const { initialLimit, setRecordLimit } = useLimitedQuery(query, {
    id: person.id,
    limit: 5,
  });

  const hasPerson = Boolean(person);
  const hasEntities = hasPerson && 'entities' in person && Boolean(person.entities);

  if (!hasEntities) return null;

  return (
    <IncidentActivityGroups
      title='Associated Entities'
      description={`${person.name} is named in lobbying reports related to these entities.`}
      icon={iconName}
    >
      {person.entities.roles.map(role => (
        <AffiliatedRecordsGroup
          key={role.role}
          notFoundLabel='No record of associated entities was found.'
          group={role}
        >
          {role.values.map((group, i: number) => (
            <AffiliatedEntitiesTable
              key={i}
              entities={group}
              hasAuxiliaryType={group.role === Role.Lobbyist}
              hasLobbyist={group.role === Role.Lobbyist}
              initialCount={initialLimit}
              model={role.model}
              role={role.role}
              setLimit={setRecordLimit}
            />
          ))}
        </AffiliatedRecordsGroup>
      ))}
    </IncidentActivityGroups>
  );
};

export default Entities;
