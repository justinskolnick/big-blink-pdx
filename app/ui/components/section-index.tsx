import React, { ReactNode } from 'react';
import { cx, css } from '@emotion/css';

import Loading from './loading';
import Pagination from './pagination';
import { Pagination as PaginationType } from '../types';

const styles = css`
  a {
    color: var(--color-link);

    &:hover {
      border-bottom: 1px solid var(--color-link);
    }

    &.is-active {
      border-bottom: 2px solid currentColor;
    }
  }

  .section-index-introduction {
    max-width: 600px;

    h4 {
      color: var(--color-accent-alt);
      font-weight: 600;
      font-size: 12px;
      line-height: 21px;
    }

    p {
      font-size: 14px;
      line-height: 21px;
    }

    blockquote {
      padding: var(--gap) calc(2 * var(--gap));
      background-color: var(--color-accent-lightest);
      border-radius: calc(var(--gap) / 2);
    }

    h4 + p {
      margin-top: calc(var(--gap) / 2);
    }

    p + p,
    p + blockquote,
    blockquote + p {
      margin-top: var(--gap);
    }
  }

  .section-index-introduction + .item-content {
    margin-top: calc(2 * var(--gap));
  }

  .item-content {
    table.section-index-list {
      width: 100%;

      th, td {
        padding: 9px;
        border-bottom: 1px solid var(--color-divider);
        vertical-align: middle;

        &:first-child {
          padding-left: 0;
        }

        &:last-child {
          padding-right: 0;
        }
      }

      th {
        padding-bottom: 18px;
      }

      td {
        &.cell-name,
        &.cell-title {
          font-weight: 600;
          font-size: 14px;
        }

        &.cell-total {
          font-weight: 400;
          font-size: 14px;
        }

        &.cell-percent {
          font-weight: 600;
          font-size: 10px;
        }
      }

      .cell-type {
        width: 14px;
        color: gray;
        font-size: 10px;
      }

      .cell-name,
      .cell-title {
        text-align: left;
      }

      .cell-total,
      .cell-percent {
        text-align: right;
      }

      .link-sort {
        color: inherit;

        &:hover {
          border-bottom: none;

          .icon {
            color: var(--color-link);
          }
        }

        &.is-active {
          border-bottom: none;

          .icon {
            color: var(--color-accent);
          }
        }

        .icon {
          font-size: 9px;
        }
      }
    }
  }

  .item-footer {
    padding: 1.5rem 0.5rem 0;
    border-top: 2px solid var(--color-divider);
    font-size: 14px;
  }

  .item-content + .item-footer {
    margin-top: 2rem;
  }

  @media screen and (max-width: 600px) {
    padding-left: var(--layout-margin);
    padding-right: var(--layout-margin);
  }
`;

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
  <section className={cx('section-index', styles, className)}>
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
