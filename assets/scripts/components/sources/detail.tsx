import React, { useRef } from 'react';
import { useParams } from 'react-router';

import Associations from '../detail-activity-associations';
import ActivityDetails from '../detail-activity-details';
import ActivityOverview from '../detail-activity-overview';
import Chart from './chart';
import Incidents from '../detail-incidents';
import IncidentsFetcher from '../detail-incidents-fetcher';
import IncidentsTrigger from './detail-incidents-trigger';
import { Container as ItemDetail } from '../item-detail';

import { useGetSourceById } from '../../reducers/sources';

import type {
  Ref,
  RefElement,
  SourceObject
} from '../../types';

interface DetailActivityProps {
  source: SourceObject;
  ref?: Ref;
}

const DetailActivity = ({ source, ref }: DetailActivityProps) => {
  const hasSource = Boolean(source);
  const hasNamedRoles = hasSource && Boolean(source.roles?.named);

  const canLoadDetails = hasSource;
  const canLoadIncidents = hasNamedRoles;

  return (
    <>
      {canLoadDetails && (
        <ActivityDetails>
          <Associations item={source} />
        </ActivityDetails>
      )}

      {canLoadIncidents && (
        <IncidentsTrigger>
          {trigger => (
            <IncidentsFetcher
              id={source.id}
              ref={ref}
              trigger={trigger}
            >
              <Incidents
                ids={source.incidents?.ids}
                filters={source.incidents?.filters}
                hasSort
                label={source.title}
                pagination={source.incidents?.pagination}
                ref={ref}
              />
            </IncidentsFetcher>
          )}
        </IncidentsTrigger>
      )}
    </>
  );
};

const Detail = () => {
  const incidentsRef = useRef<RefElement>(null);

  const { id } = useParams();
  const numericId = Number(id);

  const item = useGetSourceById(numericId);

  const hasItem = Boolean(item);
  const isActivity = item?.type === 'activity';

  const label = hasItem ? `${item.year} Q${item.quarter}` : undefined;

  if (!hasItem) return null;

  return (
    <ItemDetail>
      <ActivityOverview
        overview={item.overview}
        ref={incidentsRef}
        title={item.title}
      >
        {isActivity && <Chart label={label} />}
      </ActivityOverview>

      {isActivity && (
        <DetailActivity
          source={item}
          ref={incidentsRef}
        />
      )}
    </ItemDetail>
  );
};

export default Detail;
