import React, { useRef } from 'react';

import useFetchAndScrollOnRouteChange, {
  FetchWithCallbackRef
} from '../../hooks/use-fetch-and-scroll-on-route-change';

import PersonItem from './item';
import SectionIndex, { IntroductionContent } from '../section-index';

import useSelector from '../../hooks/use-app-selector';

import {
  getPeopleFilters,
  getPeoplePageIds,
  getPeoplePagination,
  getPeopleSection,
} from '../../selectors';

import type { RefTableElement } from '../../types';

const Index = () => {
  const ref = useRef<RefTableElement>(null);

  const filters = useSelector(getPeopleFilters);
  const pagination = useSelector(getPeoplePagination);
  const pageIds = useSelector(getPeoplePageIds);
  const section = useSelector(getPeopleSection);

  const fetch: FetchWithCallbackRef = async (callback) => {
    if (callback) {
      callback(ref);
    }
  };

  useFetchAndScrollOnRouteChange(fetch);

  return (
    <SectionIndex
      filters={filters}
      introduction={
        <IntroductionContent content={section?.introduction} />
      }
      isLoading={false}
      item={(id) => <PersonItem id={id} />}
      pageIds={pageIds}
      pagination={pagination}
      ref={ref}
      title={section?.name}
    />
  );
};

export default Index;
