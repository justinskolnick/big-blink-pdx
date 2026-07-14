import React, { useRef, ReactNode } from 'react';
import { cx } from '@emotion/css';

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
  roleIsPrimary?: boolean;
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
  roleIsPrimary,
}: Props) => {
  const incidentsRef = useRef<RefElement>(null);

  const hasItem = item !== undefined;
  const hasNamedRoles = hasItem && Boolean(item.roles?.named);
  const hasIncidents = hasItem && 'incidents' in item && item.incidents?.ids !== undefined;

  const canLoadDetails = hasItem;
  const canLoadIncidents = hasNamedRoles;

  if (!hasItem) return null;

  return (
    <Container className={className}>
      <ActivityOverview
        overview={item.overview}
        ref={incidentsRef}
        title={item.labels.overview.title}
      >
        {canLoadDetails && <Chart label={item.labels.overview.chart} />}
      </ActivityOverview>

      {canLoadDetails && (
        <Associations item={item} />
      )}

      {canLoadIncidents && (
        <IncidentsTrigger>
          {trigger => (
            <IncidentsFetcher
              id={item.id}
              ref={incidentsRef}
              trigger={trigger}
            >
              {hasIncidents && (
                <Incidents
                  filters={item.incidents?.filters}
                  hasSort
                  ids={item.incidents?.ids}
                  label={item.labels.incidents?.title}
                  pagination={item.incidents?.pagination}
                  ref={incidentsRef}
                  roleIsPrimary={roleIsPrimary}
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
