import React, { useEffect, useRef } from 'react';

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

const DetailIncidents = (({
  filters,
  hasSort,
  ids,
  label,
  pagination,
  ref,
}: Props) => {
  const params = new URLSearchParams(location.search);
  const paramsString = params.toString();

  const idsRef = useRef(null);
  const paramsStringRef = useRef(null);

  const scrollToRef = () => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (JSON.stringify(ids) !== JSON.stringify(idsRef.current)) {
      idsRef.current = ids;

      if (paramsString.length > 0 && paramsString !== paramsStringRef.current) {
        paramsStringRef.current = paramsString;
        scrollToRef();
      }
    }
  }, [
    paramsString,
    paramsStringRef,
    ids,
    idsRef,
    scrollToRef,
  ]);

  return (
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
        scrollToRef={scrollToRef}
      />
    </section>
  );
});

export default DetailIncidents;
