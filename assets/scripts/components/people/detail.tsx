import React, { useRef } from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';

import { RootState } from '../../lib/store';
import { selectors } from '../../reducers/people';

import ActivityOverview from '../detail-activity-overview';
import Attendees from './attendees';
import Chart from './chart';
import Entities from './entities';
import Incidents from '../detail-incidents';
import IncidentsFetcher from '../detail-incidents-fetcher';
import IncidentsTrigger from './detail-incidents-trigger';
import ItemDetail from '../item-detail';

const Detail = () => {
  const ref = useRef<HTMLDivElement>();

  const { id } = useParams();
  const numericId = Number(id);

  const person = useSelector((state: RootState) => selectors.selectById(state, numericId));
  const hasPerson = Boolean(person);

  if (!hasPerson) return null;

  return (
    <ItemDetail>
      <ActivityOverview
        overview={person.overview}
        ref={ref}
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

      <IncidentsTrigger>
        {trigger => (
          <IncidentsFetcher
            id={person.id}
            trigger={trigger}
          >
            <Incidents
              ids={person.incidents?.ids}
              filters={person.incidents?.filters}
              hasSort
              label={person.name}
              pagination={person.incidents?.pagination}
              ref={ref}
            />
          </IncidentsFetcher>
        )}
      </IncidentsTrigger>
    </ItemDetail>
  );
};

export default Detail;
