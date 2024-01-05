import React from 'react';

import AffiliatedItemTable from './affiliated-item-table';
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
        TitleCell={({ item }) => (
          <>
            <LinkToEntity id={item.entity.id} className='item-entity'>
              {item.entity.name}
            </LinkToEntity>
            {hasPerson && item.isRegistered && (
              <span
                className='item-status'
                title={`${person.name} is or was registered to lobby on behalf of ${item.entity.name}`}
              >
                <Icon name='check' />
              </span>
            )}
          </>
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
