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
import { Sections } from '../types';

interface Props {
  attendees: AttendeeGroup;
  model: Sections;
}

const AffiliatedPeopleTable = ({ attendees, model }: Props) => (
  <StatBox title={attendees.label}>
    <AffiliatedItemTable
      affiliatedItems={attendees.records}
      label={model}
      TypeCell={({ item }) => (
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
