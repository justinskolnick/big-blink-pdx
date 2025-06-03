import React, { ReactNode } from 'react';

import type { ItemTableLabels } from '../types';

interface Props {
  children: ReactNode;
  hasAnotherIcon?: boolean;
  hasPercent?: boolean;
  labels?: ItemTableLabels;
}

const ItemTable = ({
  children,
  hasAnotherIcon = false,
  hasPercent = false,
  labels,
}: Props) => (
  <table className='item-table' cellPadding='0' cellSpacing='0'>
    <thead>
      <tr>
        <th className='cell-name' colSpan={hasAnotherIcon ? 3 : 2} title={labels?.column.name}>Name</th>
        <th className='cell-total' title={labels?.column.total}>Total</th>
        {hasPercent && (
          <th className='cell-percent' title={labels?.column.percentage}>%</th>
        )}
      </tr>
    </thead>
    <tbody>
      {children}
    </tbody>
  </table>
);

export default ItemTable;
