import React from 'react';

import AffiliatedItemTable from './affiliated-item-table';
import EntityIcon from './entities/icon';
import Icon from './icon';
import {
  getWithEntityParams,
  FilterLink,
  LinkToEntity,
} from './links';
import StatBox from './stat-box';

import type { AffiliatedItem, Person } from '../types';

interface Props {
  entities: AffiliatedItem[];
  person?: Person;
  title?: string;
}

const RegisteredIcon = () => <Icon name='check' className='icon-registered' />;

const AffiliatedEntitiesTable = ({
  entities,
  person,
  title,
}: Props) => {
  const hasPerson = Boolean(person);

  return (
    <StatBox title={title}>
      <AffiliatedItemTable
        affiliatedItems={entities}
        label='entities'
        IconCell={({ item }) =>
          hasPerson && item.isRegistered ? (
            <div
              className='icons'
              title={`${person.name} is or was registered to lobby on behalf of ${item.entity.name}`}
            >
              <EntityIcon />
              <RegisteredIcon />
            </div>
          ) : (
            <EntityIcon />
          )
        }
        TitleCell={({ item }) => (
          <LinkToEntity id={item.entity.id} className='item-entity'>
            {item.entity.name}
          </LinkToEntity>
        )}
        TotalCell={({ item }) => (
          <FilterLink newParams={getWithEntityParams(item)} hasIcon>
            {item.total}
          </FilterLink>
        )}
      />
    </StatBox>
  );
};

export default AffiliatedEntitiesTable;
