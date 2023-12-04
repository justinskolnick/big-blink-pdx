import React from 'react';

import AffiliatedItemTable from './affiliated-item-table';
import {
  getWithPersonParams,
  FilterLink,
  LinkToPerson,
} from './links';
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
