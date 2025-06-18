import React, { useRef, useState, ReactElement, ReactNode, RefObject } from 'react';
import { cx } from '@emotion/css';

import ItemTable from './item-table';

import type { AffiliatedItem } from '../types';

type CellComponent = (ctx: { item: AffiliatedItem }) => ReactElement;

interface AffiliatedItemsProps {
  children: ReactNode;
  className?: string;
  ref?: RefObject<HTMLDivElement>
}

interface Props {
  affiliatedItems: AffiliatedItem[];
  TypeCell?: CellComponent;
  TypeAuxiliaryCell?: CellComponent;
  TitleCell: CellComponent;
  TotalCell?: CellComponent;
  label: string;
}

const AffiliatedItems = ({
  children,
  className,
  ref,
}: AffiliatedItemsProps) => (
  <div className={cx('affiliated-items', className)} ref={ref}>
    {children}
  </div>
);

const AffiliatedItemTable = ({
  affiliatedItems,
  TypeCell,
  TypeAuxiliaryCell,
  TitleCell,
  TotalCell,
  label,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);
  const initialCount = 5;
  const items = showAll ? affiliatedItems : affiliatedItems.slice(0, initialCount);
  const hasMoreToShow = affiliatedItems.length > initialCount;
  const hasItems = affiliatedItems.length > 0;

  const hasAuxiliaryType = Boolean(TypeAuxiliaryCell);

  const scrollToRef = () => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth' });
    }, 250);
  };

  return hasItems ? (
    <AffiliatedItems ref={ref}>
      <ItemTable hasAnotherIcon={hasAuxiliaryType}>
        {items.map((item, i) => {
          const hasTotal = Boolean(item.total);

          return (
            <tr key={i}>
              <td className='cell-type'><TypeCell item={item} /></td>
              {hasAuxiliaryType && (
                <td className='cell-type'><TypeAuxiliaryCell item={item} /></td>
              )}
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
    </AffiliatedItems>
  ) : (
    <AffiliatedItems className='no-results'>None found</AffiliatedItems>
  );
};

export default AffiliatedItemTable;
