import React from 'react';
import { cx, css } from '@emotion/css';

import Icon from './icon';
import { LinkToPage } from './links';
import type { Pagination as PaginationType } from '../types';

interface PaginationProps {
  onPageClick?: () => void;
  pagination: PaginationType;
}

const styles = css`
  display: flex;
  align-items: center;
  justify-content: space-between;

  .pagination-pages {
    ul {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    li + li {
      margin-left: 1rem;
    }
  }

  .pagination-page {
    font-weight: 600;
  }

  .pagination-direction {
    .icon {
      color: var(--color-table-link);
      opacity: 0.5;
    }

    a {
      .icon {
        opacity: 1;
      }
    }
  }

  @media screen and (max-width: 600px) {
    .pagination-pages {
      display: none;
    }

    .pagination-direction {
      font-size: 18px;
    }
  }
`;

const Pagination = ({ pagination, onPageClick }: PaginationProps) => {
  const { page, pageCount, pages } = pagination;

  if (!pages) return null;

  return (
    <div className={cx('pagination', styles)}>
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
            <li className='pagination-page' key={i}>
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
          <li className='pagination-page'>
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
