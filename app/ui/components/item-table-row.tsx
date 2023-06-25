import React, { ReactNode } from 'react';

interface Props {
  hasPercent?: boolean;
  name: ReactNode | string;
  percent?: string;
  total?: ReactNode | string;
  type: ReactNode | string;
}

const ItemTableRow = ({
  hasPercent = false,
  name,
  percent,
  total,
  type,
}: Props) => (
  <tr>
    <td className='cell-type'>{type}</td>
    <td className='cell-name'>{name}</td>
    <td className='cell-total'>{total ?? '-'}</td>
    {hasPercent && (
      <td className='cell-percent'>
        {percent}%
      </td>
    )}
  </tr>
);

export default ItemTableRow;
