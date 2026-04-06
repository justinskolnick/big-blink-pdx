import React, { useEffect, useRef, useState, MouseEvent, ReactNode, RefObject } from 'react';
import { useLocation } from 'react-router';
import { cx } from '@emotion/css';

import { FnSetLimit } from '../hooks/use-limited-query';

import { delayedScrollToRef, isRefTopInView } from '../lib/dom';

import { BetterLink as Link } from './links';
import ItemTable, {
  ItemTableMore,
  ItemTableMoreOptionGroup,
  ItemTableMoreOptions,
  ItemTableMoreTotal,
} from './item-table';
import ItemText from './item-text';
import ItemTextWithIcon from './item-text-with-icon';
import StatBox from './stat-box';

import type {
  AssociatedLinksObject,
  AssociatedLabeledLinkOption,
  ClassNames,
} from '../types';

interface AffiliatedItemsProps {
  children: ReactNode;
  className?: ClassNames;
  ref?: RefObject<HTMLDivElement | null>;
}

interface LinkProps {
  currentCount: number;
  link: AssociatedLabeledLinkOption;
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
  links: AssociatedLinksObject;
  ref?: RefObject<HTMLDivElement | null>;
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

const OptionsLink = ({
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

export const TableMoreLinks = ({
  currentCount,
  links,
  setLimit,
}: LinksProps) => {
  const hasIntro = Boolean(links.intro);
  const hasOptions = Boolean(links.options);
  const hasMore = Boolean(links.more);
  const hasTotal = Boolean(links.total);
  const hasGroup = hasOptions || hasMore;

  return (
    <ItemTableMore className={!hasGroup && hasTotal && 'total-only'}>
      {hasGroup && (
        <ItemTableMoreOptionGroup>

          {hasOptions && (
            <ItemTableMoreOptions>
              {hasIntro && (
                <ItemTextWithIcon className='is-intro' icon='list-ol'>
                  {links.intro?.label}
                </ItemTextWithIcon>
              )}

              {links.options?.map((option) => (
                <OptionsLink
                  key={option.params.limit}
                  link={option}
                  currentCount={currentCount}
                  setLimit={setLimit}
                />
              ))}
            </ItemTableMoreOptions>
          )}

          {hasMore && (
            <ItemTableMoreOptions>
              <ItemTextWithIcon icon='link'>
                <Link to={links.more?.path}>
                  {links.more?.label}
                </Link>
              </ItemTextWithIcon>
            </ItemTableMoreOptions>
          )}

        </ItemTableMoreOptionGroup>
      )}

      {hasTotal && (
        <ItemTableMoreTotal>
          <ItemText>
            {links.total.label}
          </ItemText>
        </ItemTableMoreTotal>
      )}
    </ItemTableMore>
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
  const tableRef = useRef<HTMLDivElement | null>(null);
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
            <TableMoreLinks
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
