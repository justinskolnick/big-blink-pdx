import React, { useRef, useState, ReactNode, RefObject } from 'react';
import { cx } from '@emotion/css';

import { delayedScrollToRef } from '../lib/dom';

import ItemTable from './item-table';
import StatBox from './stat-box';

interface AffiliatedItemsProps {
  children: ReactNode;
  className?: string;
  ref?: RefObject<HTMLDivElement>
}

interface Props {
  children: (initialCount: number, showAll: boolean) => ReactNode;
  hasAuxiliaryType?: boolean;
  label: string;
  title: string;
  total: number;
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
  label,
  title,
  total = 0,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);
  const initialCount = 5;
  const hasItems = total > 0;
  const hasMoreToShow = total > initialCount;

  const scrollToRef = () => delayedScrollToRef(ref);

  return (
    <StatBox title={title}>
      {hasItems ? (
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
                <>View all {total} {label}</>
              )}
            </button>
          )}
        </AffiliatedItems>
      ) : (
        <AffiliatedItems className='no-results'>None found</AffiliatedItems>
      )}
    </StatBox>
  );
};

export default AffiliatedItemTable;
