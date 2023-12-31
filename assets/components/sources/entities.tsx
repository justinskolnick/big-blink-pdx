import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import fetchFromPath from '../../lib/fetch-from-path';

import AffiliatedEntitiesTable from '../affiliated-entities-table';
import IncidentActivityGroups from '../incident-activity-groups';
import IncidentActivityGroup from '../incident-activity-group';

import type { AffiliatedItem, Source } from '../../types';

interface Props {
  entities: AffiliatedItem[];
  source: Source;
}

const Entities = ({ entities, source }: Props) => {
  const fetched = useRef(false);
  const location = useLocation();

  useEffect(() => {
    if (!fetched.current) {
      const { pathname } = location;

      fetchFromPath(pathname + '/entities');
      fetched.current = true;
    }
  }, [fetched, location]);

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
