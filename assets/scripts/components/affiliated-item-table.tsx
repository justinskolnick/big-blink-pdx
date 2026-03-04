import React, { useEffect, useRef, useState, MouseEvent, ReactNode, RefObject } from 'react';
import { useLocation } from 'react-router';
import { cx } from '@emotion/css';

import { FnSetLimit } from '../hooks/use-limited-query';

import { delayedScrollToRef, isRefTopInView } from '../lib/dom';

import ItemTable from './item-table';
import ItemTextWithIcon from './item-text-with-icon';
import StatBox from './stat-box';

import type { AssociatedLinksObject } from '../types';

interface AffiliatedItemsProps {
  children: ReactNode;
  className?: string;
  ref?: RefObject<HTMLDivElement>;
}

interface Props {
  children: (showAll: boolean) => ReactNode;
  hasAuxiliaryType?: boolean;
  initialCount: number;
  label: string;
  links?: AssociatedLinksObject;
  ref?: RefObject<HTMLElement>;
  setLimit: FnSetLimit;
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

const Link = ({
  initialCount,
  link,
  setLimit,
}) => {
  const location = useLocation();
  const href = location.pathname;

  const hasMoreToShow = link.params.limit > initialCount;

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    setLimit(link.params.limit);
  };

  return (
    <ItemTextWithIcon icon={hasMoreToShow ? 'plus' : 'minus'}>
      <a href={href} onClick={handleClick}>
        {link.label}
      </a>
    </ItemTextWithIcon>
  );
};

const Links = ({
  initialCount,
  links,
  setLimit,
}) => (
  <div className='item-table-more'>
    {Object.entries(links).map(([key, value]) => (
      <Link
        key={key}
        link={value}
        initialCount={initialCount}
        setLimit={setLimit}
      />
    ))}
  </div>
);

const AffiliatedItemTable = ({
  children,
  hasAuxiliaryType,
  initialCount,
  label,
  links,
  ref,
  setLimit,
  title,
  total = 0,
}: Props) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const scrollRef = ref || tableRef;

  const [showAll, setShowAll] = useState(false);
  const hasItems = total > 0;
  const hasMoreToShow = total > initialCount;
  const canSetLimit = Boolean(setLimit);

  const hasLinks = Boolean(links);

  const scrollToRef = () => delayedScrollToRef(scrollRef);

  useEffect(() => {
    if (canSetLimit && showAll) {
      setLimit(null);
    }
  }, [canSetLimit, setLimit, showAll]);
  
  return (
    <StatBox title={title}>
      {hasItems ? (
        <AffiliatedItems ref={tableRef}>
          <ItemTable hasAnotherIcon={hasAuxiliaryType}>
            {children(showAll)}
          </ItemTable>

          {hasLinks && (
            <Links
              initialCount={initialCount}
              links={links}
              setLimit={setLimit}
            />
          )}

          {hasMoreToShow && (
            <button type='button' className='button-toggle' onClick={e => {
              e.preventDefault();

              if (!isRefTopInView(scrollRef)) {
                scrollToRef();
              }

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
