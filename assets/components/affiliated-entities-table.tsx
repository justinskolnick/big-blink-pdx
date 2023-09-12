import React from 'react';

import AffiliatedItemTable from './affiliated-item-table';
import {
  getWithEntityParams,
  FilterLink,
  LinkToEntity,
} from './links';
import StatBox from './stat-box';

import type { AffiliatedItem } from '../types';

interface Props {
  entities: AffiliatedItem[];
  title?: string;
}

const AffiliatedEntitiesTable = ({
  entities,
  title,
}: Props) => (
  <StatBox title={title}>
    <AffiliatedItemTable
      affiliatedItems={entities}
      label='entities'
      TitleCell={({ item }) => (
        <LinkToEntity id={item.entity.id}>
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

export default AffiliatedEntitiesTable;
