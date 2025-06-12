import React from 'react';

import Filter, { Filters } from './filter';
import IncidentsHeader from './incidents-header';
import IncidentList from './incident-list';

import type {
  Filters as FiltersType,
  Ids,
  Pagination,
} from '../types';

interface Props {
  filters?: FiltersType;
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
      <Filters className='incidents-filters'>
        <Filter filter={filters?.entities} />
        <Filter filter={filters?.people} />
        <Filter filter={filters?.quarter} />
        <Filter filter={filters?.dates} />
      </Filters>
    </IncidentsHeader>

    <IncidentList
      hasSort={hasSort}
      ids={ids}
      pagination={pagination}
    />
  </section>
);

export default DetailIncidents;
