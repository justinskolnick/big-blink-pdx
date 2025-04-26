import React from 'react';

import IncidentsHeader, { Associations, AssociationFilter } from './incidents-header';
import IncidentList from './incident-list';

import type {
  Ids,
  IncidentsFilters,
  Pagination,
} from '../types';

interface Props {
  filters?: IncidentsFilters;
  hasSort?: boolean;
  ids: Ids;
  label: string;
  pagination: Pagination;
  ref: React.RefObject<HTMLElement>;
}

const DetailIncidents = ({
  filters,
  hasSort,
  ids,
  label,
  pagination,
  ref,
}: Props) => (
  <section className='activity-stat-section incident-list-section' ref={ref}>
    <IncidentsHeader label={label}>
      <Associations>
        <AssociationFilter filter={filters?.entities} />
        <AssociationFilter filter={filters?.people} />
        <AssociationFilter filter={filters?.quarter} />
        <AssociationFilter filter={filters?.dates} />
      </Associations>
    </IncidentsHeader>

    <IncidentList
      hasSort={hasSort}
      ids={ids}
      pagination={pagination}
    />
  </section>
);

export default DetailIncidents;
