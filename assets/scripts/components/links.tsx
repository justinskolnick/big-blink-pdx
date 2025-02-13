import React, { useEffect, useRef, useState, MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import { useLocation, useSearchParams, Link, NavLink } from 'react-router';
import { cx } from '@emotion/css';

import { getQueryParams } from '../lib/links';

import ItemTextWithIcon from './item-text-with-icon';

import type {
  AffiliatedItem,
  Id,
  LocationState,
  NewParams,
  SortByValue,
  SortValue,
} from '../types';
import { SortValues } from '../types';

interface LinkProps {
  children: ReactNode;
  className?: string;
  onClick?: (event?: ReactMouseEvent) => void;
  preventScrollReset?: boolean;
  title?: string;
  to?: string | LocationState;
}

interface LinkToPageProps extends LinkProps {
  isCurrent?: boolean;
}

interface LinkToProps {
  children: ReactNode;
  className?: string;
  to?: string | LocationState;
}

interface BetterLinkProps extends LinkProps {
  to: string | LocationState;
}

interface FilterLinkProps extends LinkProps {
  hasIcon?: boolean;
  newParams?: NewParams;
}

interface SortLinkProps extends LinkProps {
  defaultSort?: SortValue;
  newParams?: NewParams;
}

interface LinkIdProps extends LinkProps {
  id: Id;
}

export const quarterParam = 'quarter';
export const sortParam = 'sort';
export const sortByParam = 'sort_by';
export const withEntityIdParam = 'with_entity_id';
export const withPersonIdParam = 'with_person_id';

export const getSortByParam = (value: SortByValue, isDefault?: boolean) => ({
  [sortByParam]: isDefault ? null : value,
});
export const getWithEntityParams = (item: AffiliatedItem) => ({
  [withEntityIdParam]: item.entity.id,
});
export const getWithPersonParams = (item: AffiliatedItem) => ({
  [withPersonIdParam]: item.person.id,
});

const useQueryParams = (newParams: NewParams, replace = true) =>
  getQueryParams(useLocation(), newParams, replace);

const BetterLink = ({
  onClick,
  ...rest
}: BetterLinkProps) => {
  const ref = useRef<HTMLAnchorElement>();

  const handleClick = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    if (e.button || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
      const customEvent = new MouseEvent('click', {
        altKey: e.altKey,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        shiftKey: e.shiftKey,
        button: e.button,
      });

      e.preventDefault();
      ref.current.dispatchEvent(customEvent);
    } else {
      onClick?.(e);
    }
  };

  return <Link ref={ref} onClick={handleClick} {...rest} />;
};

export const LinkToQueryParams = ({
  children,
  className,
  newParams,
  ...rest
}: FilterLinkProps) => {
  const queryParams = useQueryParams(newParams);

  return (
    <Link
      to={queryParams.link}
      className={cx({
        'is-active': queryParams.isCurrent,
      }, className)}
      preventScrollReset
      {...rest}
    >
      {children}
    </Link>
  );
};

export const FilterLink = ({
  children,
  className,
  hasIcon,
  title,
  ...rest
}: FilterLinkProps) => (
  <LinkToQueryParams
    className={cx('link-filter', className)}
    title={title || 'Apply this filter'}
    {...rest}
  >
    {hasIcon ? (
      <ItemTextWithIcon icon='filter'>
        {children}
      </ItemTextWithIcon>
    ) : children}
  </LinkToQueryParams>
);

const toggleSort = (sort: string) =>
  sort === SortValues.ASC
    ? SortValues.DESC
    : SortValues.ASC;
const getIconNameForSort = (sort: string) =>
  sort === SortValues.ASC
    ? 'arrow-up'
    : 'arrow-down';

export const SortLink = ({
  children,
  className,
  title,
  newParams,
  defaultSort,
  ...rest
}: SortLinkProps) => {
  const [nextSort, setNextSort] = useState(defaultSort);
  const [searchParams] = useSearchParams();
  const params = new Map(Object.entries(newParams));

  for (const [key, value] of searchParams.entries()) {
    params.set(key, value);
  }

  const queryParams = useQueryParams(Object.fromEntries(params));
  const hasSortBy = searchParams.has('sort_by');
  const isDefault = params.get('sort_by') === null && !hasSortBy;
  const isSorted = params.get('sort_by') !== null && hasSortBy;
  const hasIcon = isDefault || isSorted;
  const icon = getIconNameForSort(toggleSort(nextSort));

  useEffect(() => {
    const sortValue = searchParams.get('sort') || defaultSort;

    if (queryParams.isCurrent) {
      setNextSort(toggleSort(sortValue));
    }
  }, [
    queryParams,
    searchParams,
    defaultSort,
    setNextSort,
  ]);

  if (queryParams.isCurrent) {
    params.set('sort', nextSort === defaultSort ? null : nextSort);
  }

  return (
    <LinkToQueryParams
      className={cx('link-sort', className)}
      title={title || 'Sort this list'}
      newParams={Object.fromEntries(params)}
      {...rest}
    >
      {hasIcon ? (
        <ItemTextWithIcon
          icon={icon}
          after
        >
          {children}
        </ItemTextWithIcon>
      ) : (children)}
    </LinkToQueryParams>
  );
};

export const GlobalLink = ({ children, to, ...rest }: LinkToProps) => (
  <NavLink
    to={to}
    className={({ isActive }) => isActive ? 'is-active' : undefined}
    {...rest}
  >
    {children}
  </NavLink>
);

export const LinkToPage = ({
  children,
  isCurrent,
  onClick,
  to,
  ...rest
}: LinkToPageProps) => (
  <NavLink
    to={to}
    className={({ isActive }) => isCurrent && isActive ? 'is-active' : undefined}
    onClick={onClick}
    preventScrollReset
    end
    {...rest}
  >
    {children}
  </NavLink>
);

export const LinkToEntities = ({ children, ...rest }: LinkProps) => (
  <BetterLink to='/entities' {...rest}>{children}</BetterLink>
);

export const LinkToEntity = ({ children, id, onClick, ...rest }: LinkIdProps) => (
  <BetterLink to={`/entities/${id}`} onClick={onClick} {...rest}>{children}</BetterLink>
);

export const LinkToIncidents = ({ children, ...rest }: LinkProps) => (
  <BetterLink to='/incidents' {...rest}>{children}</BetterLink>
);

export const LinkToIncident = ({ children, id, onClick, ...rest }: LinkIdProps) => (
  <BetterLink to={`/incidents/${id}`} onClick={onClick} {...rest}>{children}</BetterLink>
);

export const LinkToPeople = ({ children, ...rest }: LinkProps) => (
  <BetterLink to='/people' {...rest}>{children}</BetterLink>
);

export const LinkToPerson = ({ children, id, onClick, ...rest }: LinkIdProps) => (
  <BetterLink to={`/people/${id}`} onClick={onClick} {...rest}>{children}</BetterLink>
);

export const LinkToSources = ({ children, ...rest }: LinkProps) => (
  <BetterLink to='/sources' {...rest}>{children}</BetterLink>
);

export const LinkToSource = ({ children, id, onClick, ...rest }: LinkIdProps) => (
  <BetterLink to={`/sources/${id}`} onClick={onClick} {...rest}>{children}</BetterLink>
);
