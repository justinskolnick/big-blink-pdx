import React, { ReactNode } from 'react';

interface Props {
  hasPercent?: boolean;
  hasTotal?: boolean;
  name: ReactNode | string;
  percent?: string;
  total?: ReactNode | string;
  type: ReactNode | string;
}

const ItemTableRow = ({
  hasPercent = false,
  hasTotal = false,
  name,
  percent,
  total,
  type,
}: Props) => (
  <tr>
    <td className='cell-type'>{type}</td>
    <td className='cell-name'>{name}</td>
    {hasTotal ? (
      <>
        <td className='cell-total'>{total}</td>
        {hasPercent && (
          <td className='cell-percent'>{percent}%</td>
        )}
      </>
    ) : (
      <>
        <td className='cell-total'>-</td>
        {hasPercent && (
          <td className='cell-percent'>-</td>
        )}
      </>
    )}
  </tr>
);

export default ItemTableRow;
