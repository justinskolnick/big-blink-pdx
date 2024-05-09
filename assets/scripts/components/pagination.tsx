import React from 'react';
import { cx } from '@emotion/css';

import Icon from './icon';
import { LinkToPage } from './links';
import type { Pagination as PaginationType } from '../types';

interface PaginationProps {
  onPageClick?: () => void;
  pagination: PaginationType;
}

const Pagination = ({ pagination, onPageClick }: PaginationProps) => {
  const { page, pageCount, pages } = pagination;

  if (!pages) return null;

  return (
    <div className='pagination'>
      <div className='pagination-direction'>
        {pages.previous ? (
          <LinkToPage
            to={pages.previous.link}
            onClick={onPageClick}
            aria-label='Previous Page'
          >
            <Icon name='arrow-left' />
          </LinkToPage>
        ) : (
          <Icon name='arrow-left' />
        )}
      </div>

      <div className='pagination-pages'>
        <ul>
          {pages.numbered.map((numberedPage, i) => (
            <li className={cx('pagination-page', {
              'pagination-page-current': numberedPage.value === page,
              'pagination-page-option': numberedPage.value !== page,
            })} key={i}>
              {numberedPage === null ? (
                '...'
              ) : (
                pageCount > 1 ? (
                  <LinkToPage
                    to={numberedPage.link}
                    isCurrent={numberedPage.value === page}
                    onClick={onPageClick}
                  >
                    {numberedPage.label}
                  </LinkToPage>
                ) : (
                  numberedPage.label
                )
              )}
            </li>
          ))}
          <li>
            of
          </li>
          <li className='pagination-page pagination-page-total'>
            {pageCount > 1 ? (
              <LinkToPage
                to={pages.last.link}
                onClick={onPageClick}
              >
                {pages.last.label}
              </LinkToPage>
            ) : (
              pages.last.label
            )}
          </li>
        </ul>
      </div>

      <div className='pagination-direction'>
        {pages.next ? (
          <LinkToPage
            to={pages.next.link}
            onClick={onPageClick}
            aria-label='Next Page'
          >
            <Icon name='arrow-right' />
          </LinkToPage>
        ) : (
          <Icon name='arrow-right' />
        )}
      </div>
    </div>
  );
};

export default Pagination;
