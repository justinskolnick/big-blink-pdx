import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';

import { RootState } from '../../lib/store';
import { selectors } from '../../reducers/entities';

import ActivityOverview from '../incident-activity-overview';
import Attendees from './attendees';
import Chart from './chart';
import DetailIncidents from '../detail-incidents';
import DateBox from '../incident-date-box';
import IncidentStatGroup from '../incident-stat-group';
import {
  IncidentShareBox,
  IncidentTotalBox,
} from '../incident-activity-stats';
import ItemDetail from '../item-detail';
import NumbersGroup from '../stat-group-numbers';
import StatGroup from '../stat-group';

const Detail = () => {
  const ref = useRef<HTMLDivElement>();

  const scrollToRef = () => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const { id } = useParams();

  const entity = useSelector((state: RootState) => selectors.selectById(state, id));
  const hasEntity = Boolean(entity);

  const incidents = entity?.incidents;
  const hasIncidents = Boolean(incidents);

  if (!hasEntity) return null;

  return (
    <ItemDetail>
      <Helmet>
        <meta
          name='description'
          content={`Lobbying activity involving ${entity.name} according to data published by the City of Portland, Oregon`}
        />
      </Helmet>
      {hasIncidents && (
        <>
          <ActivityOverview>
            <StatGroup className='activity-numbers-and-dates'>
              <NumbersGroup>
                <IncidentShareBox>{incidents.percentage}%</IncidentShareBox>
                <IncidentTotalBox onClick={scrollToRef}>{incidents.total}</IncidentTotalBox>
              </NumbersGroup>

              {(incidents.first || incidents.last) && (
                <IncidentStatGroup className='activity-dates'>
                  <DateBox
                    title='First appearance'
                    incident={incidents.first}
                  />
                  <DateBox
                    title='Most recent appearance'
                    incident={incidents.last}
                  />
                </IncidentStatGroup>
              )}
            </StatGroup>

            <Chart label={entity.name} />
          </ActivityOverview>

          <Attendees
            attendees={entity.attendees}
            entity={entity}
          />

          <DetailIncidents
            ids={entity.incidents?.ids}
            filters={entity.incidents?.filters}
            hasSort
            label={entity.name}
            pagination={entity.incidents?.pagination}
            scrollToRef={scrollToRef}
            ref={ref}
          />
        </>
      )}
    </ItemDetail>
  );
};

export default Detail;
