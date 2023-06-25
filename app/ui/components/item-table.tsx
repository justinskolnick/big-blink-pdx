import React, { ReactNode } from 'react';
import { cx, css } from '@emotion/css';

const styles = css`
  width: 100%;

  .cell-name {
    text-align: left;
  }

  .cell-total,
  .cell-percent {
    text-align: right;
  }

  th, td {
    padding: 9px;
    vertical-align: middle;
    border-bottom: 1px solid var(--color-divider);

    &:last-child {
      padding-right: 0;
    }
  }

  th {
    &:first-child {
      padding-left: 0;
    }
  }

  td {
    &:first-child {
      padding-left: 9px;
    }

    &.cell-type {
      width: 14px;
      color: var(--color-light);
      font-size: 10px;
    }

    &.cell-name {
      font-weight: 600;
      font-size: 14px;

      a {
        color: var(--color-link);
      }
    }

    &.cell-total {
      font-weight: 400;
      font-size: 14px;
    }

    &.cell-percent {
      width: 7ch;
      font-weight: 600;
      font-size: 10px;
    }
  }
`;

interface Props {
  children: ReactNode;
  hasPercent?: boolean;
}

const ItemTable = ({
  children,
  hasPercent = false,
}: Props) => (
  <table className={cx('item-table', styles)} cellPadding='0' cellSpacing='0'>
    <thead>
      <tr>
        <th className='cell-name' colSpan={2}>Name</th>
        <th className='cell-total'>Total</th>
        {hasPercent && (
          <th className='cell-percent'>%</th>
        )}
      </tr>
    </thead>
    <tbody>
      {children}
    </tbody>
  </table>
);

export default ItemTable;
