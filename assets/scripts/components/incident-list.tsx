import React from 'react';

import IncidentListTable from './incident-list-table';
import Pagination from './pagination';

import type { Ids, Pagination as PaginationType } from '../types';

interface Props {
  hasSort?: boolean;
  ids: Ids;
  pagination: PaginationType;
  scrollToRef: () => void;
}

const IncidentList = ({
  hasSort,
  ids,
  pagination,
  scrollToRef,
}: Props) => (
  <div className='incident-list'>
    <IncidentListTable hasSort={hasSort} ids={ids} />

    {pagination && ids.length > 0 && (
      <footer className='incident-list-footer'>
        <Pagination pagination={pagination} onPageClick={scrollToRef} />
      </footer>
    )}
  </div>
);

export default IncidentList;
