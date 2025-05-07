import React from 'react';

import AffiliatedItemTable from './affiliated-item-table';
import {
  getWithPersonParams,
  FilterLink,
} from './links';
import PersonIcon from './people/icon';
import ItemLink from './people/item-link';
import StatBox from './stat-box';

import type { AttendeeGroup } from '../types';

interface Props {
  attendees: AttendeeGroup;
}

const AffiliatedPeopleTable = ({ attendees }: Props) => (
  <StatBox title={attendees.label}>
    <AffiliatedItemTable
      affiliatedItems={attendees.records}
      label='people'
      IconCell={({ item }) => (
        <PersonIcon person={item.person} />
      )}
      TitleCell={({ item }) => (
        <ItemLink item={item.person}>
          {item.person.name}
        </ItemLink>
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
