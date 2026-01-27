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

import { Role, Sections } from '../types';
import type {
  AffiliatedEntityRecord,
  AffiliatedEntityValue,
  ItemRegistrations,
} from '../types';

interface RegistrationProps {
  children: ReactNode;
  registrations?: ItemRegistrations;
}

interface AffiliatedEntityProps {
  hasAuxiliaryType?: boolean;
  hasLobbyist?: boolean;
  item: AffiliatedEntityRecord;
  role?: Role;
}

interface Props {
  entities: AffiliatedEntityValue;
  hasAuxiliaryType?: boolean;
  hasLobbyist?: boolean;
  initialCount: number;
  model: Sections;
  ref?: RefObject<HTMLElement>;
  role?: Role;
  setLimit: FnSetLimit;
  title?: string;
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
  entities,
  hasAuxiliaryType,
  hasLobbyist,
  initialCount,
  model,
  ref,
  role,
  setLimit,
  title,
}: Props) => (
  <AffiliatedItemTable
    hasAuxiliaryType={hasAuxiliaryType}
    initialCount={initialCount}
    label={model}
    ref={ref}
    setLimit={setLimit}
    title={title}
    total={entities.total}
  >
    {(showAll) => {
      const items = showAll ? entities.records : entities.records.slice(0, initialCount);

      return items.map((item, i) => (
        <AffiliatedEntity
          hasAuxiliaryType={hasAuxiliaryType}
          hasLobbyist={hasLobbyist}
          item={item}
          key={i}
          role={role}
        />
      ));
    }}
  </AffiliatedItemTable>
);

export default AffiliatedEntitiesTable;
