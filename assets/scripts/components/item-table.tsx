import React, { ReactNode } from 'react';

import type { ItemTableLabels } from '../types';

interface RowProps {
  auxiliaryType?: ReactNode;
  icon: ReactNode;
  name: string | ReactNode;
  percentage?: string | ReactNode;
  total?: number | string | ReactNode;
}

interface MoreProps {
  children: ReactNode;
}

interface Props {
  children: ReactNode;
  hasAnotherIcon?: boolean;
  hasPercent?: boolean;
  labels?: ItemTableLabels;
}

export const ItemRow = ({
  auxiliaryType,
  icon,
  name,
  percentage,
  total,
}: RowProps) => {
  const hasAuxiliaryType = Boolean(auxiliaryType);
  const hasPercentage = Boolean(percentage);
  const hasTotal = total !== null;

  return (
    <tr>
      <td className='cell-type'>{icon}</td>
      {hasAuxiliaryType && (
        <td className='cell-type'>{auxiliaryType}</td>
      )}
      <td className='cell-name'>{name}</td>
      {hasTotal && (
        <td className='cell-total'>{total}</td>
      )}
      {hasPercentage && (
        <td className='cell-percent'>{percentage}</td>
      )}
    </tr>
  );
};

export const ItemTableMore = ({ children }: MoreProps) => (
  <div className='item-table-more'>
    {children}
  </div>
);

export const ItemTableMoreOptions = ({ children }: MoreProps) => (
  <div className='item-table-more-options'>
    {children}
  </div>
);

export const ItemTableMoreTotal = ({ children }: MoreProps) => (
  <div className='item-table-more-total'>
    {children}
  </div>
);

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
