import React, { useRef } from 'react';

import useFetchAndScrollOnRouteChange, {
  FetchWithCallbackRef
} from '../../hooks/use-fetch-and-scroll-on-route-change';

import EntityItem from './item';
import SectionIndex from '../section-index';

import useSelector from '../../hooks/use-app-selector';

import {
  getEntitiesPageIds,
  getEntitiesPagination,
} from '../../selectors';

import type { RefTableElement } from '../../types';

const Introduction = () => (
  <>
    <p>
      The entities listed below reported their lobbying activity to the City of Portland. City Code (<a href='https://www.portland.gov/code/2/12/020'>2.12.020</a>) defines a “Lobbying entity” as:
    </p>
    <blockquote>
      <p>any individual, business association, corporation, partnership, association, club, company, business trust, organization or other group who lobbies either by employing or otherwise authorizing a lobbyist to lobby on that person’s behalf.</p>
    </blockquote>
  </>
);

const Index = () => {
  const ref = useRef<RefTableElement>(null);

  const pagination = useSelector(getEntitiesPagination);
  const pageIds = useSelector(getEntitiesPageIds);
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
      item={(id) => <EntityItem id={id} />}
      pageIds={pageIds}
      pagination={pagination}
      ref={ref}
    />
  );
};

export default Index;
