import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  hasAnotherIcon?: boolean;
  hasPercent?: boolean;
}

const ItemTable = ({
  children,
  hasAnotherIcon = false,
  hasPercent = false,
}: Props) => (
  <table className='item-table' cellPadding='0' cellSpacing='0'>
    <thead>
      <tr>
        <th className='cell-name' colSpan={hasAnotherIcon ? 3 : 2}>Name</th>
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
