import React from 'react';

import AffiliatedItemTable from './affiliated-item-table';
import {
  getWithPeopleParams,
  FilterLink,
} from './links';
import PersonIcon from './people/icon';
import ItemLink from './people/item-link';

import { FnSetLimit } from '../hooks/use-set-limit';

import { useGetPersonById } from '../reducers/people';

import { Role, Sections } from '../types';
import type {
  AffiliatedPersonRecord,
  AttendeeGroup,
} from '../types';

interface Props {
  attendees: AttendeeGroup;
  initialCount: number;
  model: Sections;
  setLimit: FnSetLimit;
}

interface AffiliatedPersonProps {
  item: AffiliatedPersonRecord;
  role?: Role;
}

const AffiliatedPerson = ({ item, role }: AffiliatedPersonProps) => {
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
          <FilterLink newParams={getWithPeopleParams(person, role)} hasIcon>
            {item.total}
          </FilterLink>
        ) : <>-</>}
      </td>
    </tr>
  );
};

const AffiliatedPeopleTable = ({
  attendees,
  initialCount,
  model,
  setLimit,
}: Props) => (
  <AffiliatedItemTable
    initialCount={initialCount}
    label={model}
    setLimit={setLimit}
    title={attendees.label}
    total={attendees.total}
  >
    {(initialCount, showAll) => {
      const items = showAll ? attendees.records : attendees.records.slice(0, initialCount);

      return items.map((item, i) => (
        <AffiliatedPerson
          item={item}
          key={i}
          role={attendees.role}
        />
      ));
    }}
  </AffiliatedItemTable>
);

export default AffiliatedPeopleTable;
