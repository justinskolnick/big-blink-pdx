import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../lib/store';

import IncidentsHeader, { Association } from './incidents-header';
import IncidentList from './incident-list';
import {
  dateOnParam,
  quarterParam,
  withEntityIdParam,
  withPersonIdParam,
} from './links';

import { selectors as entitiesSelectors } from '../reducers/entities';
import { selectors as peopleSelectors } from '../reducers/people';

import type { Ids, IncidentsFilters, Pagination } from '../types';

interface FiltersProps {
  filters?: IncidentsFilters;
  filterKey: keyof IncidentsFilters;
}

interface Props {
  filters?: IncidentsFilters;
  hasSort?: boolean;
  ids: Ids;
  label: string;
  pagination: Pagination;
  ref: React.RefObject<HTMLElement>;
}

const WithEntityId = ({ filters, filterKey }: FiltersProps) => {
  const filter = filters?.[filterKey];
  const hasValue = Boolean(filter?.value);
  const value = hasValue && Number(filter.value);
  const entity = useSelector((state: RootState) => hasValue && entitiesSelectors.selectById(state, value));

  if (!entity) return null;

  return (
    <Association
      filterKey={filterKey}
      label={entity.name}
    />
  );
};

const WithPersonId = ({ filters, filterKey }: FiltersProps) => {
  const filter = filters?.[filterKey];
  const hasValue = Boolean(filter?.value);
  const value = hasValue && Number(filter.value);
  const person = useSelector((state: RootState) => hasValue && peopleSelectors.selectById(state, value));

  if (!person) return null;

  return (
    <Association
      filterKey={filterKey}
      label={person.name}
    />
  );
};

const DuringQuarter = ({ filters, filterKey }: FiltersProps) => {
  const quarterFilter = filters?.[filterKey];

  if (!quarterFilter) return null;

  const label = String(quarterFilter).match(/(Q[1-4])-(20[1-2][0-9])/).slice(1,3).join(' of ');

  return (
    <Association
      filterKey={filterKey}
      intro='during'
      label={label}
    />
  );
};

const OnDate = ({ filters, filterKey }: FiltersProps) => {
  const filter = filters?.[filterKey];

  if (!filter) return null;

  return (
    <Association
      filterKey={filterKey}
      intro='on'
      label={filter.label}
    />
  );
};

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
        <WithEntityId filters={filters} filterKey={withEntityIdParam} />
        <WithPersonId filters={filters} filterKey={withPersonIdParam} />
        <DuringQuarter filters={filters} filterKey={quarterParam} />
        <OnDate filters={filters} filterKey={dateOnParam} />
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
