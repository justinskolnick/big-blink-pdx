import React from 'react';

import AffiliatedItemTable from './affiliated-item-table';
import {
  getWithPersonParams,
  FilterLink,
  LinkToPerson,
} from './links';
import StatBox from './stat-box';

import type { AffiliatedItem } from '../types';

interface Props {
  people: AffiliatedItem[];
  title: string;
}

const AffiliatedPeopleTable = ({
  people,
  title,
}: Props) => (
  <StatBox title={title}>
    <AffiliatedItemTable
      affiliatedItems={people}
      label='people'
      TitleCell={({ item }) => (
        <LinkToPerson id={item.person.id}>
          {item.person.name}
        </LinkToPerson>
      )}
      TotalCell={({ item }) => (
        <FilterLink newParams={getWithPersonParams(item)} hasIcon>
          {item.total}
        </FilterLink>
      )}
    />
  </StatBox>
);

export default AffiliatedPeopleTable;
