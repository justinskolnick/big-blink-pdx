import React, { useRef } from 'react';
import { useParams } from 'react-router';

import ActivityOverview from '../detail-activity-overview';
import Attendees from './attendees';
import Chart from './chart';
import Entities from './entities';
import IncidentActivityGroups from '../incident-activity-groups';
import Incidents from '../detail-incidents';
import IncidentsFetcher from '../detail-incidents-fetcher';
import IncidentsTrigger from './detail-incidents-trigger';
import ItemDetail from '../item-detail';
import MetaSection from '../meta-section';
import SourceInformationBox from '../source-information-box';

import { iconName as entitiesIconName } from '../entities/icon';
import { iconName as peopleIconName } from '../people/icon';

import { useGetSourceById } from '../../reducers/sources';

const getLabels = () => ({
  attendees: {
    title: 'Associated Names',
  },
  entities: {
    title: 'Associated Entities',
  },
});

const Detail = () => {
  const incidentsRef = useRef<HTMLDivElement>(null);

  const { id } = useParams();
  const numericId = Number(id);

  const source = useGetSourceById(numericId);
  const labels = getLabels();

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

          <IncidentActivityGroups title={labels.attendees.title} icon={entitiesIconName}>
            <Entities source={source} />
          </IncidentActivityGroups>

          <IncidentActivityGroups title={labels.entities.title} icon={peopleIconName}>
            <Attendees source={source} />
          </IncidentActivityGroups>

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
