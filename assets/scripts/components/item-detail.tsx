import React, { useRef, ReactNode } from 'react';
import { cx } from '@emotion/css';

import ActivityDetails from './detail-activity-details';
import ActivityOverview from './detail-activity-overview';
import Associations from './detail-activity-associations';
import Incidents from './detail-incidents';
import IncidentsFetcher from './detail-incidents-fetcher';

import type { TriggerChildren } from '../services/api';

import type {
  ItemDetailObject,
  RefElement,
} from '../types';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

interface ChartProps {
  label?: string;
}

interface TriggerProps {
  children: TriggerChildren;
}

interface Props {
  Chart: (props: ChartProps) => ReactNode;
  className?: string;
  IncidentsTrigger: (props: TriggerProps) => ReactNode;
  item?: ItemDetailObject;
}

export const Container = ({
  children,
  className,
}: ContainerProps) => (
  <section className={cx('item-detail', className)}>
    {children}
  </section>
);

const ItemDetail = ({
  Chart,
  className,
  IncidentsTrigger,
  item,
}: Props) => {
  const incidentsRef = useRef<RefElement>(null);

  const hasItem = item !== undefined;
  const hasNamedRoles = hasItem && Boolean(item.roles?.named);

  const canLoadDetails = hasItem;
  const canLoadIncidents = hasNamedRoles;

  if (!hasItem) return null;

  return (
    <Container className={className}>
      <ActivityOverview
        overview={item.overview}
        ref={incidentsRef}
        title={item.name}
      >
        <Chart label={item.name} />
      </ActivityOverview>

      {canLoadDetails && (
        <ActivityDetails>
          <Associations item={item} />
        </ActivityDetails>
      )}

      {canLoadIncidents && (
        <IncidentsTrigger>
          {trigger => (
            <IncidentsFetcher
              id={item.id}
              ref={incidentsRef}
              trigger={trigger}
            >
              {'incidents' in item && (
                <Incidents
                  filters={item.incidents?.filters}
                  hasSort
                  ids={item.incidents?.ids}
                  label={item.name}
                  pagination={item.incidents?.pagination}
                  ref={incidentsRef}
                  roleIsPrimary
                />
              )}
            </IncidentsFetcher>
          )}
        </IncidentsTrigger>
      )}
    </Container>
  );
};

export default ItemDetail;
