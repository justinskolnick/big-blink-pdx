import React from 'react';

import AffiliatedEntitiesTable from '../affiliated-entities-table';
import IncidentActivityGroups from '../incident-activity-groups';
import IncidentActivityGroup from '../incident-activity-group';
import { iconName } from '../entities/icon';

import useLimitedQuery from '../../hooks/use-limited-query';

import api from '../../services/api';

import type { Source, SourceEntities } from '../../types';

interface Props {
  entities: SourceEntities;
  source: Source;
}

const Entities = ({ entities, source }: Props) => {
  const query = api.useLazyGetSourceEntitiesByIdQuery;

  const { initialLimit, setRecordLimit } = useLimitedQuery(query, {
    id: source.id,
    limit: 5,
  });

  const hasEntities = 'entities' in source && Boolean(source.entities);
  const hasRecords = hasEntities && entities.values.some(v => v.records.length);

  return (
    <IncidentActivityGroups title='Associated Entities' icon={iconName}>
      {hasRecords ? (
        <IncidentActivityGroup group={entities}>
          {entities.values.map((group, i: number) =>(
            <AffiliatedEntitiesTable
              key={i}
              entities={group}
              initialCount={initialLimit}
              model={entities.model}
              setLimit={setRecordLimit}
            />
          ))}
        </IncidentActivityGroup>
      ) : null}
    </IncidentActivityGroups>
  );
};

export default Entities;
