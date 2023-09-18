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
import ItemDetail from '../item-detail';

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
          <ActivityOverview
            incidents={incidents}
            scrollToRef={scrollToRef}
          >
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
