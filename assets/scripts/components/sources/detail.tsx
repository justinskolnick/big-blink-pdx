import React, { useRef } from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';

import { RootState } from '../../lib/store';

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

import { selectors } from '../../reducers/sources';

const Detail = () => {
  const ref = useRef<HTMLDivElement>(null);

  const { id } = useParams();
  const numericId = Number(id);

  const source = useSelector((state: RootState) => selectors.selectById(state, numericId));
  const hasSource = Boolean(source);

  const label = source ? `Q${source.quarter} ${source.year}` : null;

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
        ref={ref}
      >
        <Chart label={label} />
      </ActivityOverview>

      {isActivity && (
        <>
          <Entities
            entities={source.entities}
            source={source}
          />

          <Attendees attendees={source.attendees} />

          <IncidentsTrigger>
            {trigger => (
              <IncidentsFetcher
                id={source.id}
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
        </>
      )}
    </ItemDetail>
  );
};

export default Detail;
