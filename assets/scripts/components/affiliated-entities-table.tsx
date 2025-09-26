import React from 'react';

import AffiliatedItemTable from './affiliated-item-table';
import EntityIcon from './entities/icon';
import EntityItemLink from './entities/item-link';
import Icon from './icon';
import {
  getWithEntityParams,
  FilterLink,
} from './links';
import PersonIcon from './people/icon';

import { FnSetLimit } from '../hooks/use-limited-query';

import { useGetEntityById } from '../reducers/entities';

import { Role, Sections } from '../types';
import type {
  AffiliatedEntityRecord,
  AffiliatedEntityValue,
} from '../types';

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
  role?: Role;
  setLimit: FnSetLimit;
  title?: string;
}

const RegisteredIcon = () => <Icon name='check' className='icon-registered' />;

const AffiliatedEntity = ({
  hasAuxiliaryType,
  hasLobbyist,
  item,
  role,
}: AffiliatedEntityProps) => {
  const entity = useGetEntityById(item.entity.id);

  return (
    <tr>
      <td className='cell-type'>
        {entity.isRegistered ? (
          <div
            className='icons'
            title='Entity has been registered'
          >
            <EntityIcon />
            <RegisteredIcon />
          </div>
        ) : (
          <EntityIcon />
        )}
      </td>
      {hasAuxiliaryType && (
        <td className='cell-type'>
          <div
            className='icons'
            title={item.isRegistered ? 'Lobbyist has been registered' : item.registrations}
          >
            <PersonIcon />
            {item.isRegistered && <RegisteredIcon />}
          </div>
        </td>
      )}
      <td className='cell-name'>
        <EntityItemLink item={entity}>
          {entity.name}
        </EntityItemLink>
        {hasLobbyist && (
          <div className='item-description'>
            {item.registrations}
          </div>
        )}
      </td>
      <td className='cell-total'>
        {item.total ? (
          <FilterLink newParams={getWithEntityParams(entity, role)} hasIcon>
            {item.total}
          </FilterLink>
        ) : <>-</>}
      </td>
    </tr>
  );
};

const AffiliatedEntitiesTable = ({
  entities,
  hasAuxiliaryType,
  hasLobbyist,
  initialCount,
  model,
  role,
  setLimit,
  title,
}: Props) => (
  <AffiliatedItemTable
    hasAuxiliaryType={hasAuxiliaryType}
    initialCount={initialCount}
    label={model}
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
