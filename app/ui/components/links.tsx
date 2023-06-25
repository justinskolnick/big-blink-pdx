import React, { MouseEvent, ReactNode } from 'react';
import { useLocation, Link, NavLink } from 'react-router-dom';
import { cx } from '@emotion/css';

import { getQueryParams } from '../lib/links';

import ItemTextWithIcon from './item-text-with-icon';

import type { AffiliatedItem, Id, LocationState, NewParams } from '../types';
import { SortByValue } from '../types';

export interface LinkProps {
  children: ReactNode;
  className?: string;
  hasIcon?: boolean;
  newParams?: NewParams;
  title?: string;
}

interface LinkToPageProps {
  children: ReactNode;
  isCurrent?: boolean;
  onClick: () => void;
  to: string | LocationState;
}

interface LinkToProps {
  children: ReactNode;
  className?: string;
  to: string | LocationState;
}

interface LinkIdProps {
  children: ReactNode;
  className?: string;
  id: Id;
  onClick?: (event?: MouseEvent) => void;
}

export const quarterParam = 'quarter';
export const sortByParam = 'sort_by';
export const withEntityIdParam = 'with_entity_id';
export const withPersonIdParam = 'with_person_id';

export const getSortByParam = (value: SortByValue) => ({
  [sortByParam]: value === SortByValue.Name ? null : value,
});
export const getWithEntityParams = (item: AffiliatedItem) => ({
  [withEntityIdParam]: item.entity.id,
});
export const getWithPersonParams = (item: AffiliatedItem) => ({
  [withPersonIdParam]: item.person.id,
});

const useQueryParams = (newParams: NewParams, replace = true) =>
  getQueryParams(useLocation(), newParams, replace);

export const LinkToQueryParams = ({
  children,
  className,
  newParams,
  ...rest
}: LinkProps) => {
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
}: LinkProps) => (
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

export const SortLink = ({
  children,
  className,
  title,
  ...rest
}: LinkProps) => (
  <LinkToQueryParams
    className={cx('link-sort', className)}
    title={title || 'Sort this list'}
    {...rest}
  >
    {children}
  </LinkToQueryParams>
);

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
  <Link to='/entities' {...rest}>{children}</Link>
);

export const LinkToEntity = ({ children, id, onClick, ...rest }: LinkIdProps) => (
  <Link to={`/entities/${id}`} onClick={onClick} {...rest}>{children}</Link>
);

export const LinkToIncidents = ({ children, ...rest }: LinkProps) => (
  <Link to='/incidents' {...rest}>{children}</Link>
);

export const LinkToIncident = ({ children, id, onClick, ...rest }: LinkIdProps) => (
  <Link to={`/incidents/${id}`} onClick={onClick} {...rest}>{children}</Link>
);

export const LinkToPeople = ({ children, ...rest }: LinkProps) => (
  <Link to='/people' {...rest}>{children}</Link>
);

export const LinkToPerson = ({ children, id, onClick, ...rest }: LinkIdProps) => (
  <Link to={`/people/${id}`} onClick={onClick} {...rest}>{children}</Link>
);

export const LinkToSources = ({ children, ...rest }: LinkProps) => (
  <Link to='/sources' {...rest}>{children}</Link>
);

export const LinkToSource = ({ children, id, onClick, ...rest }: LinkIdProps) => (
  <Link to={`/sources/${id}`} onClick={onClick} {...rest}>{children}</Link>
);
