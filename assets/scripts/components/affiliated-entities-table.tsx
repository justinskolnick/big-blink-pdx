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
import StatBox from './stat-box';

import { useGetEntityById } from '../reducers/entities';

import { Role, Sections } from '../types';
import type {
  AffiliatedEntityRecord,
  AffiliatedEntityValue,
  Person,
} from '../types';

interface AffiliatedEntityProps {
  hasAuxiliaryType: boolean;
  hasLobbyist: boolean;
  item: AffiliatedEntityRecord;
}

interface Props {
  entities: AffiliatedEntityValue;
  lobbyistName?: Person['name'];
  model: Sections;
  title?: string;
}

const RegisteredIcon = () => <Icon name='check' className='icon-registered' />;

const AffiliatedEntity = ({
  hasAuxiliaryType,
  hasLobbyist,
  item,
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
          <FilterLink newParams={getWithEntityParams(entity)} hasIcon>
            {item.total}
          </FilterLink>
        ) : <>-</>}
      </td>
    </tr>
  );
};

const AffiliatedEntitiesTable = ({
  entities,
  lobbyistName,
  model,
  title,
}: Props) => {
  const hasAuxiliaryType = entities.role === Role.Lobbyist;
  const hasLobbyist = Boolean(lobbyistName);

  return (
    <StatBox title={title}>
      <AffiliatedItemTable
        hasAuxiliaryType={hasAuxiliaryType}
        itemCount={entities.records.length}
        label={model}
      >
        {(initialCount, showAll) => {
          const items = showAll ? entities.records : entities.records.slice(0, initialCount);

          return items.map((item, i) => (
            <AffiliatedEntity
              hasAuxiliaryType={hasAuxiliaryType}
              hasLobbyist={hasLobbyist}
              item={item}
              key={i}
            />
          ));
        }}
      </AffiliatedItemTable>
    </StatBox>
  );
};

export default AffiliatedEntitiesTable;
