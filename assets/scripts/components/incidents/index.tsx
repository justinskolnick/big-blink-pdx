import React, { useRef } from 'react';
import { useSelector } from 'react-redux';

import IncidentList from '../incident-list';
import SectionIndex from '../section-index';

import { getIncidentsPageIds, getIncidentsPagination } from '../../selectors';

const Introduction = () => (
  <p>
    Lobbying entities are required to register with the City Auditor and submit quarterly lobbying activity reports to the Auditor’s office (<a href='https://www.portland.gov/code/2/12/040'>2.12.040</a>). City Code identifies the information included in each report as public record (<a href='https://www.portland.gov/code/2/12/100'>2.12.100</a>). The incidents listed below have been extracted from the published quarterly lobbying reports and sorted in chronological order. Click an incident row for more details.
  </p>
);

const Index = () => {
  const ref = useRef<HTMLDivElement>(null);
  const scrollToRef = () => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const pagination = useSelector(getIncidentsPagination);
  const pageIds = useSelector(getIncidentsPageIds);
  const hasPageIds = pageIds?.length > 0;

  return (
    <SectionIndex
      introduction={<Introduction />}
      isLoading={!hasPageIds}
    >
      <div className='incident-list-anchor' ref={ref}>
        <IncidentList
          hasSort
          ids={pageIds}
          pagination={pagination}
          scrollToRef={scrollToRef}
        />
      </div>
    </SectionIndex>
  );
};

export default Index;
