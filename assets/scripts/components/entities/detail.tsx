import React, { useRef } from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';

import { RootState } from '../../lib/store';
import { selectors } from '../../reducers/entities';

import ActivityOverview from '../incident-activity-overview';
import Attendees from './attendees';
import Chart from './chart';
import DetailIncidents from '../detail-incidents';
import ItemDetail from '../item-detail';

const Detail = () => {
  const ref = useRef<HTMLDivElement>();

  const { id } = useParams();
  const numericId = Number(id);

  const entity = useSelector((state: RootState) => selectors.selectById(state, numericId));
  const hasEntity = Boolean(entity);

  const incidents = entity?.incidents;
  const hasIncidents = Boolean(incidents?.stats.totals?.values.total.value);

  if (!hasEntity) return null;

  return (
    <ItemDetail>
      <ActivityOverview
        incidents={incidents}
        ref={ref}
      >
        <Chart label={entity.name} />
      </ActivityOverview>

      {hasIncidents && (
        <>
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
            ref={ref}
          />
        </>
      )}
    </ItemDetail>
  );
};

export default Detail;
