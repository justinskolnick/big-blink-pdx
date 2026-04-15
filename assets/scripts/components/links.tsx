import React, { useRef, MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import { useSearchParams, Link, NavLink } from 'react-router';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { cx } from '@emotion/css';

import {
  peopleParam,
  roleParam,
  sortParam,
  sortByParam,
  withEntityIdParam,
} from '../config/constants';
import useQueryParams from '../hooks/use-query-params';

import ItemTextWithIcon from './item-text-with-icon';

import {
  Role,
  SortByValues,
  SortValues,
  type EntityObject,
  type LinkTo,
  type NewParams,
  type PersonObject,
  type SortValue,
} from '../types';

export interface LinkProps {
  children: ReactNode;
  className?: string;
  onClick?: (event?: ReactMouseEvent) => void;
  preventScrollReset?: boolean;
  title?: string;
  to?: LinkTo;
}

interface LinkToPageProps extends LinkProps {
  isCurrent?: boolean;
  to: LinkTo;
}

interface GlobalLinkProps {
  children: ReactNode;
  className?: string;
  to: LinkTo;
}

interface BetterLinkProps extends LinkProps {
  to: LinkTo;
}

interface FilterLinkProps extends LinkProps {
  hasIcon?: boolean;
  newParams: NewParams;
  replace?: boolean;
}

interface SortLinkProps extends LinkProps {
  defaultSort: SortValue;
  isDefault?: boolean;
  name?: SortByValues;
}

export const getWithEntityParams = (entity: EntityObject, role?: Role) => {
  const params = {} as NewParams;

  if (role) {
    params[roleParam] = role;
  }

  params[withEntityIdParam] = entity.id;

  return params;
};

export const getWithPeopleParams = (person: PersonObject, personRole?: Role, role?: Role) => {
  const params = {} as NewParams;

  if (role) {
    params[roleParam] = role;
  }

  if (personRole) {
    params[peopleParam] = `${person.id}:${personRole}`;
  } else {
    params[peopleParam] = person.id;
  }

  return params;
};

export const BetterLink = ({
  onClick,
  ...rest
}: BetterLinkProps) => {
  const ref = useRef<HTMLAnchorElement | null>(null);

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
      ref.current?.dispatchEvent(customEvent);
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
  replace,
  ...rest
}: FilterLinkProps) => {
  const queryParams = useQueryParams(newParams, replace);

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
const getIconNameForSort = (sort: string): IconName =>
  sort === SortValues.ASC
    ? 'arrow-up'
    : 'arrow-down';

export const SortLink = ({
  children,
  className,
  defaultSort,
  isDefault,
  name,
  title,
  ...rest
}: SortLinkProps) => {
  const [searchParams] = useSearchParams();
  const currentSortBy = searchParams.get(sortByParam);
  const currentSort = searchParams.get(sortParam);
  const isCurrentSortBy = name === currentSortBy || (currentSortBy === null && isDefault);
  const newSearchParams = new Map<string, string | null | undefined>(searchParams);
  let icon;

  if (isCurrentSortBy) {
    newSearchParams.set(sortByParam, isDefault ? null : name);

    if (currentSort === null) {
      newSearchParams.set(sortParam, toggleSort(defaultSort));
      icon = getIconNameForSort(defaultSort);
    } else {
      newSearchParams.set(sortParam, null);
      icon = getIconNameForSort(toggleSort(defaultSort));
    }
  } else {
    newSearchParams.set(sortByParam, isDefault ? null : name);
    newSearchParams.set(sortParam, null);
  }

  const hasIcon = Boolean(icon);

  return (
    <LinkToQueryParams
      className={cx('link-sort', className)}
      title={title || 'Sort this list'}
      newParams={Object.fromEntries(newSearchParams.entries())}
      {...rest}
    >
      {hasIcon ? (
        <ItemTextWithIcon
          icon={icon}
          after
        >
          {children}
        </ItemTextWithIcon>
      ) : children}
    </LinkToQueryParams>
  );
};

export const GlobalLink = ({ children, to, ...rest }: GlobalLinkProps) => (
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

export const LinkToIncidents = ({ children, ...rest }: LinkProps) => (
  <BetterLink to='/incidents' {...rest}>{children}</BetterLink>
);

export const LinkToSources = ({ children, ...rest }: LinkProps) => (
  <BetterLink to='/sources' {...rest}>{children}</BetterLink>
);
