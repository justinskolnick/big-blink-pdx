import React, { useRef, useState, ReactNode, RefObject } from 'react';
import { cx } from '@emotion/css';

import { delayedScrollToRef } from '../lib/dom';

import ItemTable from './item-table';

interface AffiliatedItemsProps {
  children: ReactNode;
  className?: string;
  ref?: RefObject<HTMLDivElement>
}

interface Props {
  children: (initialCount: number, showAll: boolean) => ReactNode;
  hasAuxiliaryType?: boolean;
  itemCount: number;
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
  children,
  hasAuxiliaryType,
  itemCount,
  label,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);
  const initialCount = 5;
  const hasItems = itemCount > 0;
  const hasMoreToShow = itemCount > initialCount;

  const scrollToRef = () => delayedScrollToRef(ref);

  return hasItems ? (
    <AffiliatedItems ref={ref}>
      <ItemTable hasAnotherIcon={hasAuxiliaryType}>
        {children(initialCount, showAll)}
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
            <>View all {itemCount} {label}</>
          )}
        </button>
      )}
    </AffiliatedItems>
  ) : (
    <AffiliatedItems className='no-results'>None found</AffiliatedItems>
  );
};

export default AffiliatedItemTable;
