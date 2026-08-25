import React, { useRef } from 'react';

import useFetchAndScrollOnRouteChange, {
  FetchWithCallbackRef
} from '../../hooks/use-fetch-and-scroll-on-route-change';

import EntityItem from './item';
import SectionIndex, { IntroductionContent } from '../section-index';

import useSelector from '../../hooks/use-app-selector';

import {
  getEntitiesFilters,
  getEntitiesPageIds,
  getEntitiesPagination,
  getEntitiesSection,
} from '../../selectors';

import type { RefDivElement } from '../../types';

const Index = () => {
  const ref = useRef<RefDivElement>(null);

  const filters = useSelector(getEntitiesFilters);
  const pagination = useSelector(getEntitiesPagination);
  const pageIds = useSelector(getEntitiesPageIds);
  const section = useSelector(getEntitiesSection);

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
      item={(id) => <EntityItem id={id} />}
      pageIds={pageIds}
      pagination={pagination}
      ref={ref}
      title={section?.name}
    />
  );
};

export default Index;
