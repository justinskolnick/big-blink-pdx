import React, { ReactNode } from 'react';
import { cx } from '@emotion/css';

import Loading from './loading';
import Pagination from './pagination';
import type { Pagination as PaginationType } from '../types';

interface Props {
  children: ReactNode;
  className?: string;
  introduction?: ReactNode;
  isLoading?: boolean;
  pagination?: PaginationType;
}

const SectionIndex = ({
  children,
  className,
  introduction,
  isLoading = true,
  pagination,
}: Props) => (
  <section className={cx('section-index', className)}>
    {introduction && (
      <section className='section-index-introduction'>
        <h4>Introduction</h4>

        {introduction}
      </section>
    )}

    <div className='item-content'>
      {isLoading ? <Loading /> : children}
    </div>

    {pagination && (
      <footer className='item-footer'>
        <Pagination pagination={pagination} />
      </footer>
    )}
  </section>
);

export default SectionIndex;
