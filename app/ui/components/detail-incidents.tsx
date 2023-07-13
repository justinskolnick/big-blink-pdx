import React, { useEffect, useRef, forwardRef } from 'react';
import { useSelector } from 'react-redux';
import { cx, css } from '@emotion/css';

import { RootState } from '../lib/store';

import IncidentsHeader, { Association } from './incidents-header';
import IncidentList from './incident-list';
import {
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
  scrollToRef: () => void;
}

const styles = css`
  .activity-stat-section + & {
    padding-top: calc(3 * var(--gap));
    border-top: 3px solid var(--color-divider);
  }

  .item-subhead + .incident-list {
    margin-top: calc(2 * var(--gap));
  }
`;

const WithEntityId = ({ filters, filterKey }: FiltersProps) => {
  const id = filters?.[filterKey];
  const entity = useSelector((state: RootState) => id && entitiesSelectors.selectById(state, id));

  if (!entity) return null;

  return (
    <Association
      filterKey={filterKey}
      label={entity.name}
    />
  );
};

const WithPersonId = ({ filters, filterKey }: FiltersProps) => {
  const id = filters?.[filterKey];
  const person = useSelector((state: RootState) => id && peopleSelectors.selectById(state, id));

  if (!person) return null;

  return (
    <Association
      filterKey={filterKey}
      label={person.name}
    />
  );
};

const DuringQuarter = ({ filters, filterKey }: FiltersProps) => {
  const quarterParam = filters?.[filterKey];

  if (!quarterParam) return null;

  const label = String(quarterParam).match(/(Q[1-4])-(20[1-2][0-9])/).slice(1,3).join(' of ');

  return (
    <Association
      filterKey={filterKey}
      intro='during'
      label={label}
    />
  );
};

const DetailIncidents = forwardRef<HTMLDivElement, Props>(({
  filters,
  hasSort,
  ids,
  label,
  pagination,
  scrollToRef,
}, ref) => {
  const params = new URLSearchParams(location.search);
  const paramsString = params.toString();

  const idsRef = useRef(null);
  const paramsStringRef = useRef(null);

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
    <section className={cx(
      'activity-stat-section incident-list-section',
      styles,
    )} ref={ref}>
      <IncidentsHeader label={label}>
        <WithEntityId filters={filters} filterKey={withEntityIdParam} />
        <WithPersonId filters={filters} filterKey={withPersonIdParam} />
        <DuringQuarter filters={filters} filterKey={quarterParam} />
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

DetailIncidents.displayName = 'DetailIncidents';

export default DetailIncidents;
