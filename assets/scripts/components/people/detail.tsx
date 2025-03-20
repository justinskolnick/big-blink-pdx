import React, { useRef } from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';

import { RootState } from '../../lib/store';
import { selectors } from '../../reducers/people';

import ActivityOverview from '../detail-activity-overview';
import Attendees from './attendees';
import Chart from './chart';
import DetailIncidents from '../detail-incidents';
import Entities from './entities';
import ItemDetail from '../item-detail';

const Detail = () => {
  const ref = useRef<HTMLDivElement>();

  const { id } = useParams();
  const numericId = Number(id);

  const person = useSelector((state: RootState) => selectors.selectById(state, numericId));
  const hasPerson = Boolean(person);
  const hasIncidents = Boolean(person?.incidents?.ids?.length);

  if (!hasPerson) return null;

  return (
    <ItemDetail>
      <ActivityOverview
        overview={person.overview}
        ref={ref}
      >
        <Chart label={person.name} />
      </ActivityOverview>

      {hasIncidents && (
        <>
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
            ref={ref}
          />
        </>
      )}
    </ItemDetail>
  );
};

export default Detail;
