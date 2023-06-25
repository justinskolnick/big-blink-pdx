import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from '../../lib/store';
import { selectors } from '../../reducers/people';

import ActivityOverview from '../incident-activity-overview';
import Attendees from './attendees';
import Chart from './chart';
import DateBox from '../incident-date-box';
import IncidentStatGroup from '../incident-stat-group';
import DetailIncidents from '../detail-incidents';
import Entities from './entities';
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

  const person = useSelector((state: RootState) => selectors.selectById(state, id));
  const hasPerson = Boolean(person);

  const incidents = person?.incidents;
  const hasIncidents = Boolean(incidents);

  if (!hasPerson) return null;

  return (
    <ItemDetail>
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

            <Chart label={person.name} />
          </ActivityOverview>

          <Entities
            entities={person.entities}
            person={person}
          />

          <Attendees
            attendees={person.attendees}
            person={person}
          />

          <DetailIncidents
            ids={person.incidents?.ids}
            filters={person.incidents?.filters}
            label={person.name}
            pagination={person.incidents?.pagination}
            scrollToRef={scrollToRef}
            ref={ref}
          />
        </>
      )}
    </ItemDetail>
  );
};

export default Detail;
