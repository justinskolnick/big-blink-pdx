import React, { useRef, ReactNode } from 'react';
import { cx } from '@emotion/css';

import useSelector from '../hooks/use-app-selector';
import useGetItemById from '../hooks/use-get-item-by-id';

import ActivityOverview from './detail-activity-overview';
import ActivityOverviewChart from './detail-activity-overview-chart';
import Associations from './detail-activity-associations';
import Incidents from './detail-incidents';
import IncidentsFetcher from './detail-incidents-fetcher';
import IncidentsTrigger from './detail-incidents-trigger';
import { ItemChartStacked as ItemChart } from './item-chart';

import { getCurrent } from '../selectors';

import type { RefElement } from '../types';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

interface Props {
  className?: string;
}

export const Container = ({
  children,
  className,
}: ContainerProps) => (
  <section className={cx('item-detail', className)}>
    {children}
  </section>
);

const ItemDetail = ({ className }: Props) => {
  const incidentsRef = useRef<RefElement>(null);

  const item = useGetItemById();
  const current = useSelector(getCurrent);

  let roleIsPrimary = false;

  if (current) {
    roleIsPrimary = ['entities', 'people'].includes(current.section);
  }

  const hasItem = item !== undefined;
  const hasNamedRoles = item && Boolean(item?.roles?.named);
  const hasIncidents = item && 'incidents' in item && item.incidents?.ids !== undefined;

  const canLoadDetails = hasItem;
  const canLoadIncidents = hasNamedRoles;

  if (!item) return null;

  return (
    <Container className={className}>
      <ActivityOverview
        overview={item.overview}
        ref={incidentsRef}
        title={item.labels.overview.title}
      >
        {canLoadDetails && (
          roleIsPrimary ? (
            <ActivityOverviewChart
              label={item.labels.overview.chart}
              stats={item.overview?.stats}
            />
          ) : (
            <ItemChart label={item.labels.overview.chart} />
          )
        )}
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
