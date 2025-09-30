import React from 'react';

import AffiliatedEntitiesTable from '../affiliated-entities-table';
import IncidentActivityGroups from '../incident-activity-groups';
import AffiliatedRecordsGroup from '../affiliated-records-group';
import { iconName } from '../entities/icon';

import useLimitedQuery from '../../hooks/use-limited-query';

import api from '../../services/api';

import type { Source } from '../../types';
import { Role } from '../../types';

interface Props {
  source: Source;
}

const Entities = ({ source }: Props) => {
  const query = api.useLazyGetSourceEntitiesByIdQuery;

  const { initialLimit, setRecordLimit } = useLimitedQuery(query, {
    id: source.id,
    limit: 5,
  });

  const hasSource = Boolean(source);
  const hasEntities = hasSource && 'entities' in source && Boolean(source.entities);

  if (!hasEntities) return null;

  return (
    <IncidentActivityGroups title='Associated Entities' icon={iconName}>
      <AffiliatedRecordsGroup
        group={source.entities}
        notFoundLabel='No record of associated entities was found.'
      >
        {source.entities.values.map((group, i: number) =>(
          <AffiliatedEntitiesTable
            key={i}
            entities={group}
            hasAuxiliaryType={group.role === Role.Lobbyist}
            initialCount={initialLimit}
            model={source.entities.model}
            setLimit={setRecordLimit}
          />
        ))}
      </AffiliatedRecordsGroup>
    </IncidentActivityGroups>
  );
};

export default Entities;
