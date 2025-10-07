import React, { useRef } from 'react';
import { useParams } from 'react-router';

import { useGetEntityById } from '../../reducers/entities';

import ActivityOverview from '../detail-activity-overview';
import Attendees from './attendees';
import Chart from './chart';
import IncidentActivityGroups from '../incident-activity-groups';
import Incidents from '../detail-incidents';
import IncidentsFetcher from '../detail-incidents-fetcher';
import IncidentsTrigger from './detail-incidents-trigger';
import ItemDetail from '../item-detail';

import { iconName as peopleIconName } from '../people/icon';

import type { Entity } from '../../types';

const getLabels = (entity: Entity) => {
  const identity = entity?.name ?? 'this entity';

  return {
    attendees: {
      description: `These people appear in lobbying reports related to ${identity}${identity.endsWith('.') ? '' : '.'}`,
      title: 'Associated Names',
    },
  };
};

const Detail = () => {
  const incidentsRef = useRef<HTMLDivElement>(null);

  const { id } = useParams();
  const numericId = Number(id);

  const entity = useGetEntityById(numericId);
  const labels = getLabels(entity);

  const hasEntity = Boolean(entity);

  if (!hasEntity) return null;

  return (
    <ItemDetail>
      <ActivityOverview
        overview={entity.overview}
        ref={incidentsRef}
      >
        <Chart label={entity.name} />
      </ActivityOverview>

      <IncidentActivityGroups
        title={labels.attendees.title}
        description={labels.attendees.description}
        icon={peopleIconName}
      >
        <Attendees entity={entity} />
      </IncidentActivityGroups>

      <IncidentsTrigger>
        {trigger => (
          <IncidentsFetcher
            id={entity.id}
            ref={incidentsRef}
            trigger={trigger}
          >
            <Incidents
              ids={entity.incidents?.ids}
              filters={entity.incidents?.filters}
              hasSort
              label={entity.name}
              pagination={entity.incidents?.pagination}
              ref={incidentsRef}
            />
          </IncidentsFetcher>
        )}
      </IncidentsTrigger>
    </ItemDetail>
  );
};

export default Detail;
