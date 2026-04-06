import React, { ReactNode, RefObject } from 'react';

import AffiliatedItemTable from './affiliated-item-table';
import EntityIcon from './entities/icon';
import EntityItemLink from './entities/item-link';
import {
  getWithEntityParams,
  FilterLink,
} from './links';
import Icon from './icon';
import { ItemRow } from './item-table';
import PersonIcon from './people/icon';

import { FnSetLimit } from '../hooks/use-limited-query';

import { useGetEntityById } from '../reducers/entities';

import { Role } from '../types';
import type {
  AffiliatedEntityObjectRecord,
  AffiliatedEntityObjectValue,
  AssociatedLinksObject,
  ItemRegistrations,
} from '../types';

interface RegistrationProps {
  children: ReactNode;
  registrations?: ItemRegistrations;
}

interface AffiliatedEntityProps {
  hasAuxiliaryType?: boolean;
  hasLobbyist?: boolean;
  item: AffiliatedEntityObjectRecord;
  role?: Role;
}

interface Props {
  currentLimit: number;
  entities: AffiliatedEntityObjectValue;
  hasAuxiliaryType?: boolean;
  hasLobbyist?: boolean;
  initialCount: number;
  links: AssociatedLinksObject;
  ref?: RefObject<HTMLDivElement | null>;
  role?: Role;
  setLimit: FnSetLimit;
  title: string;
}

const Registration = ({
  children,
  registrations,
}: RegistrationProps) => (
  registrations ? (
    <div
      className='icons'
      title={registrations.labels.title}
    >
      {children}
      {registrations.isRegistered && (
        <Icon name='check' className='icon-registered' />
      )}
    </div>
  ) : (
    children
  )
);

const AffiliatedEntity = ({
  hasAuxiliaryType,
  hasLobbyist,
  item,
  role,
}: AffiliatedEntityProps) => {
  const entity = useGetEntityById(item.entity.id);

  if (!entity) return null;

  return (
    <ItemRow
      auxiliaryType={hasAuxiliaryType && (
        <Registration registrations={item.lobbyist}>
          <PersonIcon />
        </Registration>
      )}
      icon={
        hasAuxiliaryType ? (
          <Registration registrations={entity.registrations}>
            <EntityIcon />
          </Registration>
        ) : (
          <EntityIcon />
        )
      }
      name={(
        <>
          <EntityItemLink item={entity}>
            {entity.name}
          </EntityItemLink>
          {hasLobbyist && (
            <div className='item-description'>
              {item.lobbyist.labels.statement}
            </div>
          )}
        </>
      )}
      total={(
        <FilterLink newParams={getWithEntityParams(entity, role)} hasIcon>
          {item.total}
        </FilterLink>
      )}
    />
  );
};

const AffiliatedEntitiesTable = ({
  currentLimit,
  entities,
  hasAuxiliaryType,
  hasLobbyist,
  initialCount,
  links,
  ref,
  role,
  setLimit,
  title,
}: Props) => (
  <AffiliatedItemTable
    currentLimit={currentLimit}
    hasAuxiliaryType={hasAuxiliaryType}
    initialCount={initialCount}
    links={links}
    ref={ref}
    setLimit={setLimit}
    title={title}
    total={entities.total}
  >
    {entities.records.map((item, i) => (
      <AffiliatedEntity
        hasAuxiliaryType={hasAuxiliaryType}
        hasLobbyist={hasLobbyist}
        item={item}
        key={i}
        role={role}
      />
    ))}
  </AffiliatedItemTable>
);

export default AffiliatedEntitiesTable;
