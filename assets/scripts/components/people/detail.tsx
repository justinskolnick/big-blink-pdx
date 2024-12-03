import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from '../../lib/store';
import { selectors } from '../../reducers/people';

import ActivityOverview from '../incident-activity-overview';
import Attendees from './attendees';
import Chart from './chart';
import DetailIncidents from '../detail-incidents';
import Entities from './entities';
import IncidentActivityGroup from '../incident-activity-group';
import ItemDetail from '../item-detail';

const Detail = () => {
  const ref = useRef<HTMLDivElement>();

  const scrollToRef = () => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const { id } = useParams();
  const numericId = Number(id);

  const person = useSelector((state: RootState) => selectors.selectById(state, numericId));
  const hasPerson = Boolean(person);

  const incidents = person?.incidents;
  const hasIncidents = incidents?.stats.totals?.values.length > 0;

  if (!hasPerson) return null;

  return (
    <ItemDetail>
      {hasIncidents ? (
        <>
          <ActivityOverview
            incidents={incidents}
            scrollToRef={scrollToRef}
          >
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
            hasSort
            label={person.name}
            pagination={person.incidents?.pagination}
            scrollToRef={scrollToRef}
            ref={ref}
          />
        </>
      ) : (
        <IncidentActivityGroup
          title='No associated records were found.'
        />
      )}
    </ItemDetail>
  );
};

export default Detail;
