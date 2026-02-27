import React, { useRef, RefObject } from 'react';
import { useParams } from 'react-router';

import Associations from '../detail-activity-associations';
import ActivityDetails from '../detail-activity-details';
import ActivityOverview from '../detail-activity-overview';
import Chart from './chart';
import Incidents from '../detail-incidents';
import IncidentsFetcher from '../detail-incidents-fetcher';
import IncidentsTrigger from './detail-incidents-trigger';
import ItemDetail from '../item-detail';
import MetaSection from '../meta-section';
import SourceInformationBox from '../source-information-box';

import { useGetSourceById } from '../../reducers/sources';

import type { Source } from '../../types';

interface DetailActivityProps {
  source: Source;
  ref: RefObject<HTMLDivElement>;
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
  const incidentsRef = useRef<HTMLDivElement>(null);

  const { id } = useParams();
  const numericId = Number(id);

  const source = useGetSourceById(numericId);

  const hasSource = Boolean(source);
  const isActivity = source?.type === 'activity';

  const label = hasSource ? `${source.year} Q${source.quarter}` : null;

  if (!hasSource) return null;

  return (
    <ItemDetail>
      <MetaSection>
        <SourceInformationBox
          title='Source Information'
          source={source}
        />
      </MetaSection>

      <ActivityOverview
        overview={source.overview}
        ref={incidentsRef}
      >
        <Chart label={label} />
      </ActivityOverview>

      {isActivity && (
        <DetailActivity
          source={source}
          ref={incidentsRef}
        />
      )}
    </ItemDetail>
  );
};

export default Detail;
