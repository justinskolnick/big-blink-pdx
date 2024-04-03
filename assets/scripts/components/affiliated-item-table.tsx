import React, { useRef, useState, ReactElement } from 'react';

import ItemTable from './item-table';

import type { AffiliatedItem } from '../types';

type CellComponent = (ctx: { item: AffiliatedItem }) => ReactElement;

interface Props {
  affiliatedItems: AffiliatedItem[];
  IconCell?: CellComponent;
  TitleCell: CellComponent;
  TotalCell?: CellComponent;
  label: string;
}

const AffiliatedItemTable = ({
  affiliatedItems,
  IconCell,
  TitleCell,
  TotalCell,
  label,
}: Props) => {
  const ref = useRef<HTMLDivElement>();
  const [showAll, setShowAll] = useState(false);
  const initialCount = 5;
  const items = showAll ? affiliatedItems : affiliatedItems.slice(0, initialCount);
  const hasMoreToShow = affiliatedItems.length > initialCount;
  const hasItems = affiliatedItems.length > 0;

  const scrollToRef = () => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth' });
    }, 250);
  };

  return hasItems ? (
    <div className='affiliated-items' ref={ref}>
      <ItemTable>
        {items.map((item, i) => {
          const hasTotal = Boolean(item.total);

          return (
            <tr key={i}>
              <td className='cell-type'><IconCell item={item} /></td>
              <td className='cell-name'><TitleCell item={item} /></td>
              <td className='cell-total'>
                {hasTotal ? (
                  TotalCell ? <TotalCell item={item} /> : item.total
                ) : '-'}
              </td>
            </tr>
          );
        })}
      </ItemTable>

      {hasMoreToShow && (
        <button type='button' className='button-toggle' onClick={e => {
          e.preventDefault();
          scrollToRef();
          setShowAll(!showAll);
        }}>
          {showAll ? (
            <>View top {initialCount} {label}</>
          ) : (
            <>View all {affiliatedItems.length} {label}</>
          )}
        </button>
      )}
    </div>
  ) : (
    <div className='affiliated-items no-results'>None found</div>
  );
};

export default AffiliatedItemTable;
