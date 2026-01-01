import React, { useRef } from 'react';
import { useParams } from 'react-router';

import { useGetPersonById } from '../../reducers/people';

import Associations from '../detail-activity-associations';
import ActivityDetails from '../detail-activity-details';
import ActivityOverview from '../detail-activity-overview';
import Chart from './chart';
import Incidents from '../detail-incidents';
import IncidentsFetcher from '../detail-incidents-fetcher';
import IncidentsTrigger from './detail-incidents-trigger';
import ItemDetail from '../item-detail';

const Detail = () => {
  const incidentsRef = useRef<HTMLDivElement>(null);

  const { id } = useParams();
  const numericId = Number(id);

  const person = useGetPersonById(numericId);

  const hasPerson = Boolean(person);
  const hasNamedRoles = hasPerson && Boolean(person.roles?.named);

  const canLoadDetails = hasPerson;
  const canLoadIncidents = hasNamedRoles;

  if (!hasPerson) return null;

  return (
    <ItemDetail>
      <ActivityOverview
        overview={person.overview}
        ref={incidentsRef}
      >
        <Chart label={person.name} />
      </ActivityOverview>

      {canLoadDetails && (
        <ActivityDetails>
          <Associations item={person} />
        </ActivityDetails>
      )}

      {canLoadIncidents && (
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
      )}
    </ItemDetail>
  );
};

export default Detail;
