import React from 'react';
import { cx, css } from '@emotion/css';

import IncidentListTable from './incident-list-table';
import Pagination from './pagination';

import type { Ids, Pagination as PaginationType } from '../types';

interface Props {
  hasSort?: boolean;
  ids: Ids;
  pagination: PaginationType;
  scrollToRef: () => void;
}

const styles = css`
  font-size: 12px;
  line-height: 18px;

  a {
    color: var(--color-table-link);

    &.is-active {
      border-bottom: 2px solid currentColor;
    }
  }

  .incident-list-footer {
    padding: 18px 9px;
    color: var(--color-table-footer-color);
  }
`;

const IncidentList = ({
  hasSort,
  ids,
  pagination,
  scrollToRef,
}: Props) => (
  <div className={cx('incident-list', styles)}>
    <IncidentListTable hasSort={hasSort} ids={ids} />

    {pagination && ids.length > 0 && (
      <footer className='incident-list-footer'>
        <Pagination pagination={pagination} onPageClick={scrollToRef} />
      </footer>
    )}
  </div>
);

export default IncidentList;
