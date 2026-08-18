import React, { useRef } from 'react';

import useFetchAndScrollOnRouteChange, {
  FetchWithCallbackRef
} from '../../hooks/use-fetch-and-scroll-on-route-change';

import EntityItem from './item';
import SectionIndex, { IntroductionContent } from '../section-index';

import useSelector from '../../hooks/use-app-selector';

import {
  getEntitiesPageIds,
  getEntitiesPagination,
  getEntitiesSection,
} from '../../selectors';

import type { RefTableElement } from '../../types';

const Index = () => {
  const ref = useRef<RefTableElement>(null);

  const pagination = useSelector(getEntitiesPagination);
  const pageIds = useSelector(getEntitiesPageIds);
  const section = useSelector(getEntitiesSection);

  const hasPageIds = pageIds?.length > 0;

  const fetch: FetchWithCallbackRef = async (callback) => {
    if (callback) {
      callback(ref);
    }
  };

  useFetchAndScrollOnRouteChange(fetch);

  return (
    <SectionIndex
      introduction={
        <IntroductionContent content={section?.introduction} />
      }
      isLoading={!hasPageIds}
      item={(id) => <EntityItem id={id} />}
      pageIds={pageIds}
      pagination={pagination}
      ref={ref}
    />
  );
};

export default Index;
