import React, { useRef } from 'react';
import { useParams } from 'react-router';

import ActivityOverview from '../detail-activity-overview';
import Attendees from './attendees';
import Chart from './chart';
import Entities from './entities';
import Incidents from '../detail-incidents';
import IncidentsFetcher from '../detail-incidents-fetcher';
import IncidentsTrigger from './detail-incidents-trigger';
import ItemDetail from '../item-detail';
import MetaSection from '../meta-section';
import SourceInformationBox from '../source-information-box';

import { useGetSourceById } from '../../reducers/sources';

const Detail = () => {
  const incidentsRef = useRef<HTMLDivElement>(null);

  const { id } = useParams();
  const numericId = Number(id);

  const source = useGetSourceById(numericId);
  const hasSource = Boolean(source);

  const label = source ? `${source.year} Q${source.quarter}` : null;

  const isActivity = source?.type === 'activity';

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
        <>
          <Entities source={source} />

          <Attendees attendees={source.attendees} />

          <IncidentsTrigger>
            {trigger => (
              <IncidentsFetcher
                id={source.id}
                ref={incidentsRef}
                trigger={trigger}
              >
                <Incidents
                  ids={source.incidents?.ids}
                  filters={source.incidents?.filters}
                  hasSort
                  label={source.title}
                  pagination={source.incidents?.pagination}
                  ref={incidentsRef}
                />
              </IncidentsFetcher>
            )}
          </IncidentsTrigger>
        </>
      )}
    </ItemDetail>
  );
};

export default Detail;
