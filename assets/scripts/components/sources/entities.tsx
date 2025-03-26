import React, { useEffect } from 'react';

import AffiliatedEntitiesTable from '../affiliated-entities-table';
import IncidentActivityGroups from '../incident-activity-groups';
import IncidentActivityGroup from '../incident-activity-group';

import api from '../../services/api';

import type { AffiliatedItem, Source } from '../../types';

interface Props {
  entities: AffiliatedItem[];
  source: Source;
}

const Entities = ({ entities, source }: Props) => {
  const [trigger] = api.useLazyGetSourceEntitiesByIdQuery();

  const hasEntities = entities?.length > 0;

  useEffect(() => {
    if (!hasEntities) {
      trigger({ id: source.id });
    }
  }, [hasEntities, source, trigger]);

  return (
    <IncidentActivityGroups title='Associated Entities'>
      {entities ? (
        <IncidentActivityGroup
          icon='briefcase'
          title={`These entities appear in ${source.title}`}
        >
          <AffiliatedEntitiesTable entities={entities} />
        </IncidentActivityGroup>
      ) : null}
    </IncidentActivityGroups>
  );
};

export default Entities;
