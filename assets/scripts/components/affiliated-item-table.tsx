import React, { useRef, useState, ReactElement } from 'react';

import ItemTable from './item-table';
import ItemTableRow from './item-table-row';

import type { AffiliatedItem } from '../types';

interface Props {
  affiliatedItems: AffiliatedItem[];
  IconCell: (ctx: { item: AffiliatedItem }) => ReactElement;
  TitleCell: (ctx: { item: AffiliatedItem }) => ReactElement;
  TotalCell?: (ctx: { item: AffiliatedItem }) => ReactElement;
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
        {items.map((item, i) => (
          <ItemTableRow
            key={i}
            name={<TitleCell item={item} />}
            hasTotal={Boolean(item.total)}
            total={TotalCell ? <TotalCell item={item} /> : item.total}
            type={<IconCell item={item} />}
          />
        ))}
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
