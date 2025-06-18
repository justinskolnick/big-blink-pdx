import React, { useEffect } from 'react';

import AffiliatedEntitiesTable from '../affiliated-entities-table';
import IncidentActivityGroups from '../incident-activity-groups';
import IncidentActivityGroup from '../incident-activity-group';
import { iconName } from '../entities/icon';

import api from '../../services/api';

import type { Source, SourceEntities } from '../../types';

interface Props {
  entities: SourceEntities;
  source: Source;
}

const Entities = ({ entities, source }: Props) => {
  const [trigger] = api.useLazyGetSourceEntitiesByIdQuery();

  const hasEntities = 'entities' in source && Boolean(source.entities);
  const hasRecords = hasEntities && entities.values.some(v => v.records.length);

  useEffect(() => {
    if (!hasEntities) {
      trigger({ id: source.id });
    }
  }, [hasEntities, source, trigger]);

  return (
    <IncidentActivityGroups title='Associated Entities' icon={iconName}>
      {hasRecords ? (
        <IncidentActivityGroup group={entities}>
          {entities.values.map((group, i: number) =>(
            <AffiliatedEntitiesTable key={i} entities={group} />
          ))}
        </IncidentActivityGroup>
      ) : null}
    </IncidentActivityGroups>
  );
};

export default Entities;
