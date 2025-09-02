import React from 'react';

import Filter, { Filters } from './filter';
import IncidentsHeader, { PrimaryAssociation } from './incidents-header';
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
  roleIsPrimary?: boolean;
}

const DetailIncidents = ({
  filters,
  hasSort,
  ids,
  label,
  pagination,
  ref,
  roleIsPrimary,
}: Props) => (
  <section className='activity-stat-section incident-list-section' ref={ref}>
    <IncidentsHeader subtitle={
      <PrimaryAssociation label={label}>
        {roleIsPrimary && (
          <Filter filter={filters?.role} inline />
        )}
      </PrimaryAssociation>
    }>
      <Filters className='incidents-filters'>
        <Filter filter={filters?.entities} />
        {roleIsPrimary ? (
          <Filter filter={filters?.people} />
        ) : (
          <Filter filter={filters?.people} filterRelated={filters?.role} />
        )}
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
