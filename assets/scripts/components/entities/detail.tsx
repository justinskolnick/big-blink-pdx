import React, { useRef } from 'react';
import { useParams } from 'react-router';

import { useGetEntityById } from '../../reducers/entities';

import Associations from '../detail-activity-associations';
import ActivityDetails from '../detail-activity-details';
import ActivityOverview from '../detail-activity-overview';
import Chart from './chart';
import Incidents from '../detail-incidents';
import IncidentsFetcher from '../detail-incidents-fetcher';
import IncidentsTrigger from './detail-incidents-trigger';
import ItemDetail from '../item-detail';

const Detail = () => {
  const incidentsRef = useRef<HTMLDivElement>(null);

  const { id } = useParams();
  const numericId = Number(id);

  const entity = useGetEntityById(numericId);

  const hasEntity = Boolean(entity);
  const hasNamedRoles = hasEntity && Boolean(entity.roles?.named);

  const canLoadDetails = hasEntity;
  const canLoadIncidents = hasNamedRoles;

  if (!hasEntity) return null;

  return (
    <ItemDetail>
      <ActivityOverview
        overview={entity.overview}
        ref={incidentsRef}
      >
        <Chart label={entity.name} />
      </ActivityOverview>

      {canLoadDetails && (
        <ActivityDetails>
          <Associations item={entity} />
        </ActivityDetails>
      )}

      {canLoadIncidents && (
        <IncidentsTrigger>
          {trigger => (
            <IncidentsFetcher
              id={entity.id}
              ref={incidentsRef}
              trigger={trigger}
            >
              {'incidents' in entity && (
                <Incidents
                  ids={entity.incidents?.ids}
                  filters={entity.incidents?.filters}
                  hasSort
                  label={entity.name}
                  pagination={entity.incidents?.pagination}
                  ref={incidentsRef}
                  roleIsPrimary
                />
              )}
            </IncidentsFetcher>
          )}
        </IncidentsTrigger>
      )}
    </ItemDetail>
  );
};

export default Detail;
