import React, { useRef } from 'react';
import { useParams } from 'react-router';

import { useGetPersonById } from '../../reducers/people';

import ActivityOverview from '../detail-activity-overview';
import Attendees from './attendees';
import Chart from './chart';
import Entities from './entities';
import IncidentActivityGroups from '../incident-activity-groups';
import Incidents from '../detail-incidents';
import IncidentsFetcher from '../detail-incidents-fetcher';
import IncidentsTrigger from './detail-incidents-trigger';
import ItemDetail from '../item-detail';

import { iconName as entitiesIconName } from '../entities/icon';
import { iconName as peopleIconName } from '../people/icon';

const getLabels = (person) => {
  const identity = person?.name ?? 'This person';

  return {
    attendees: {
      description: `${identity} is named in lobbying reports that also include these people.`,
      title: 'Associated Names',
    },
    entities: {
      description: `${identity} is named in lobbying reports related to these entities.`,
      title: 'Associated Entities',
    },
  };
};

const Detail = () => {
  const incidentsRef = useRef<HTMLDivElement>(null);

  const { id } = useParams();
  const numericId = Number(id);

  const person = useGetPersonById(numericId);
  const labels = getLabels(person);

  const hasPerson = Boolean(person);

  if (!hasPerson) return null;

  return (
    <ItemDetail>
      <ActivityOverview
        overview={person.overview}
        ref={incidentsRef}
      >
        <Chart label={person.name} />
      </ActivityOverview>

      <IncidentActivityGroups
        title={labels.entities.title}
        description={labels.entities.description}
        icon={entitiesIconName}
      >
        <Entities person={person} />
      </IncidentActivityGroups>

      <IncidentActivityGroups
        title={labels.attendees.title}
        description={labels.attendees.description}
        icon={peopleIconName}
      >
        <Attendees person={person} />
      </IncidentActivityGroups>

      <IncidentsTrigger>
        {trigger => (
          <IncidentsFetcher
            id={person.id}
            ref={incidentsRef}
            trigger={trigger}
          >
            {'incidents' in person && (
              <Incidents
                filters={person.incidents?.filters}
                hasSort
                ids={person.incidents?.ids}
                label={person.name}
                pagination={person.incidents?.pagination}
                ref={incidentsRef}
                roleIsPrimary
              />
            )}
          </IncidentsFetcher>
        )}
      </IncidentsTrigger>
    </ItemDetail>
  );
};

export default Detail;
