import React from 'react';

import AffiliatedItemTable from './affiliated-item-table';
import {
  getWithPersonParams,
  FilterLink,
} from './links';
import PersonIcon from './people/icon';
import ItemLink from './people/item-link';
import StatBox from './stat-box';

import { useGetPersonById } from '../reducers/people';

import type {
  AffiliatedPersonRecord,
  AttendeeGroup,
} from '../types';
import { Sections } from '../types';

interface Props {
  attendees: AttendeeGroup;
  model: Sections;
}

interface AffiliatedPersonProps {
  item: AffiliatedPersonRecord;
}

const AffiliatedPerson = ({ item }: AffiliatedPersonProps) => {
  const person = useGetPersonById(item.person.id);

  return (
    <tr>
      <td className='cell-type'>
        <PersonIcon person={person} />
      </td>
      <td className='cell-name'>
        <ItemLink item={person}>
          {person.name}
        </ItemLink>
      </td>
      <td className='cell-total'>
        {item.total ? (
          <FilterLink newParams={getWithPersonParams(person)} hasIcon>
            {item.total}
          </FilterLink>
        ) : <>-</>}
      </td>
    </tr>
  );
};

const AffiliatedPeopleTable = ({ attendees, model }: Props) => (
  <StatBox title={attendees.label}>
    <AffiliatedItemTable
      itemCount={attendees.records.length}
      label={model}
    >
      {(initialCount, showAll) => {
        const items = showAll ? attendees.records : attendees.records.slice(0, initialCount);

        return items.map((item, i) => (
          <AffiliatedPerson
            item={item}
            key={i}
          />
        ));
      }}
    </AffiliatedItemTable>
  </StatBox>
);

export default AffiliatedPeopleTable;
