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

import type { AffiliatedEntityRecord, AffiliatedEntityValue, Person } from '../types';
import { Role, Sections } from '../types';

interface Props {
  entities: AffiliatedEntityValue;
  lobbyistName?: Person['name'];
  model: Sections;
  title?: string;
}

const RegisteredIcon = () => <Icon name='check' className='icon-registered' />;

const AffiliatedEntitiesTable = ({
  entities,
  lobbyistName,
  model,
  title,
}: Props) => {
  const hasLobbyist = Boolean(lobbyistName);
  let auxiliary;

  if (entities.role === Role.Lobbyist) {
    auxiliary = {
      TypeAuxiliaryCell: ({ item }: { item: AffiliatedEntityRecord }) => (
        item.isRegistered ? (
          <div
            className='icons'
            title={`${lobbyistName} is or was registered to lobby the City on behalf of ${item.entity.name}`}
          >
            <PersonIcon />
            <RegisteredIcon />
          </div>
        ) : (
          <PersonIcon />
        )
      ),
    };
  }

  return (
    <StatBox title={title}>
      <AffiliatedItemTable
        affiliatedItems={entities.records}
        label={model}
        TypeCell={({ item }) => (
          item.entity.isRegistered ? (
            <div
              className='icons'
              title={`${item.entity.name} is or was registered to lobby the City`}
            >
              <EntityIcon />
              <RegisteredIcon />
            </div>
          ) : (
            <EntityIcon />
          )
        )}
        {...auxiliary}
        TitleCell={({ item }) => (
          <>
            <EntityItemLink item={item.entity}>
              {item.entity.name}
            </EntityItemLink>
            {hasLobbyist && (
              <div className='item-description'>
                {item.registrations}
              </div>
            )}
          </>
        )}
        TotalCell={({ item }) => (
          item.total ? (
            <FilterLink newParams={getWithEntityParams(item)} hasIcon>
              {item.total}
            </FilterLink>
          ) : <>-</>
        )}
      />
    </StatBox>
  );
};

export default AffiliatedEntitiesTable;
