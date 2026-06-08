import React, { useRef } from 'react';

import useFetchAndScrollOnRouteChange, {
  FetchWithCallbackRef
} from '../../hooks/use-fetch-and-scroll-on-route-change';

import PersonItem from './item';
import SectionIndex from '../section-index';

import useSelector from '../../hooks/use-app-selector';

import {
  getPeoplePageIds,
  getPeoplePagination,
} from '../../selectors';

import type { RefTableElement } from '../../types';

const Introduction = () => (
  <>
    <p>
      The names listed below include City officials and lobbyists whose names appear in lobbying activity reports published by the City of Portland. City Code (<a href='https://www.portland.gov/code/2/12/020'>2.12.020</a>) defines a “City official” as:
    </p>
    <blockquote>
      <p>any City elected official; the at will staff of a City elected official; any City director as defined in this section; or appointee to the Portland Development Commission, the Planning Commission, the Design Commission, and the Fire and Police Disability and Retirement Board.</p>
    </blockquote>
    <p>
       and a “Lobbyist” as:
    </p>
    <blockquote>
      <p>any individual who is authorized to lobby on behalf of a lobbying entity.</p>
    </blockquote>
  </>
);

const Index = () => {
  const ref = useRef<RefTableElement>(null);

  const pagination = useSelector(getPeoplePagination);
  const pageIds = useSelector(getPeoplePageIds);
  const hasPageIds = pageIds?.length > 0;

  const fetch: FetchWithCallbackRef = async (callback) => {
    if (callback) {
      callback(ref);
    }
  };

  useFetchAndScrollOnRouteChange(fetch);

  return (
    <SectionIndex
      introduction={<Introduction />}
      isLoading={!hasPageIds}
      item={(id) => <PersonItem id={id} />}
      pageIds={pageIds}
      pagination={pagination}
      ref={ref}
    />
  );
};

export default Index;
