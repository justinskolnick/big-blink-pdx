import React, { useEffect, useRef, useState, MouseEvent, ReactNode, RefObject } from 'react';
import { useLocation } from 'react-router';
import { cx } from '@emotion/css';

import { FnSetLimit } from '../hooks/use-limited-query';

import { delayedScrollToRef, isRefTopInView } from '../lib/dom';

import ItemTable from './item-table';
import ItemText from './item-text';
import StatBox from './stat-box';

import type {
  AssociatedLinksObject,
  AssociatedLinksOption,
} from '../types';

interface AffiliatedItemsProps {
  children: ReactNode;
  className?: string;
  ref?: RefObject<HTMLDivElement>;
}

interface LinkProps {
  currentCount: number;
  link: AssociatedLinksOption;
  setLimit: FnSetLimit;
}

interface LinksProps {
  currentCount: number;
  links: AssociatedLinksObject;
  setLimit: FnSetLimit;
}

interface Props {
  children: ReactNode;
  currentLimit: number;
  hasAuxiliaryType?: boolean;
  initialCount: number;
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
  currentCount,
  link,
  setLimit,
}: LinkProps) => {
  const location = useLocation();
  const href = location.pathname;

  const isSelected = link.params.limit === currentCount;

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    setLimit(link.params.limit);
  };

  return (
    <ItemText className={isSelected && 'is-selected'}>
      <a href={href} onClick={handleClick}>
        {link.label}
      </a>
    </ItemText>
  );
};

const Links = ({
  currentCount,
  links,
  setLimit,
}: LinksProps) => {
  const hasOptions = Boolean(links.options);

  return (
    <div className='item-table-more'>
      <div className='item-table-more-total'>
        <ItemText>
          {links.total.label}
        </ItemText>
      </div>

      <div className='item-table-more-options'>
        {hasOptions && links.options.map((option) => (
          <Link
            key={option.params.limit}
            link={option}
            currentCount={currentCount}
            setLimit={setLimit}
          />
        ))}
      </div>
    </div>
  );
};

const AffiliatedItemTable = ({
  children,
  currentLimit,
  hasAuxiliaryType,
  initialCount,
  links,
  ref,
  setLimit,
  title,
  total = 0,
}: Props) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const scrollRef = ref || tableRef;

  const [lastCount, setLastCount] = useState<number>(initialCount);

  const hasItems = total > 0;
  const hasLinks = Boolean(links);

  const scrollToRef = () => delayedScrollToRef(scrollRef);
  const refIsInView = () => isRefTopInView(scrollRef);

  useEffect(() => {
    if (currentLimit !== lastCount) {
      setLastCount(currentLimit);

      if (!refIsInView()) {
        scrollToRef();
      }
    }
  }, [
    currentLimit,
    isRefTopInView,
    lastCount,
    refIsInView,
    scrollToRef,
    setLastCount,
  ]);

  return (
    <StatBox title={title}>
      {hasItems ? (
        <AffiliatedItems ref={tableRef}>
          <ItemTable hasAnotherIcon={hasAuxiliaryType}>
            {children}
          </ItemTable>

          {hasLinks && (
            <Links
              currentCount={currentLimit}
              links={links}
              setLimit={setLimit}
            />
          )}
        </AffiliatedItems>
      ) : (
        <AffiliatedItems className='no-results'>None found</AffiliatedItems>
      )}
    </StatBox>
  );
};

export default AffiliatedItemTable;
