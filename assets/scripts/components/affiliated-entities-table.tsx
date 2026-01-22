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
} from '../types';

interface RegistrationProps {
  children: ReactNode;
  isRegistered?: boolean;
  title: string;
}

interface ItemRegistrationProps {
  item: AffiliatedEntityRecord;
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
  isRegistered,
  title
}: RegistrationProps) => (
  <div
    className='icons'
    title={title}
  >
    {children}
    {isRegistered && (
      <Icon name='check' className='icon-registered' />
    )}
  </div>
);

const LobbyistRegistration = ({ item }: ItemRegistrationProps) => (
  <Registration
    isRegistered={item.isRegistered}
    title={item.isRegistered ? 'Lobbyist has been registered' : item.registrations}
  >
    <PersonIcon />
  </Registration>
);

const EntityRegistration = () => (
  <Registration
    title='Entity has been registered'
  >
    <EntityIcon />
  </Registration>
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
        <LobbyistRegistration item={item} />
      )}
      icon={entity.isRegistered ? (
        <EntityRegistration />
      ) : (
        <EntityIcon />
      )}
      name={(
        <>
          <EntityItemLink item={entity}>
            {entity.name}
          </EntityItemLink>
          {hasLobbyist && (
            <div className='item-description'>
              {item.registrations}
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
