import React from 'react';

import IncidentList from '../incident-list';
import SectionIndex, { IntroductionContent } from '../section-index';

import useFetchAndScrollOnRouteChange from '../../hooks/use-fetch-and-scroll-on-route-change';
import useSelector from '../../hooks/use-app-selector';

import {
  getIncidentsPageIds,
  getIncidentsPagination,
  getIncidentsSection,
} from '../../selectors';

const Index = () => {
  const pagination = useSelector(getIncidentsPagination);
  const pageIds = useSelector(getIncidentsPageIds);
  const section = useSelector(getIncidentsSection);

  const hasPagination = pagination !== undefined;
  const hasPageIds = pageIds?.length > 0;

  useFetchAndScrollOnRouteChange();

  return (
    <SectionIndex
      introduction={
        <IntroductionContent content={section?.introduction} />
      }
      isLoading={!hasPagination || !hasPageIds}
    >
      <div className='incident-list-anchor'>
        {hasPagination && hasPageIds && (
          <IncidentList
            hasSort
            ids={pageIds}
            pagination={pagination}
          />
        )}
      </div>
    </SectionIndex>
  );
};

export default Index;
