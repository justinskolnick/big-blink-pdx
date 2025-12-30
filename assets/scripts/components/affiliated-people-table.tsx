import React, { RefObject } from 'react';

import AffiliatedItemTable from './affiliated-item-table';
import {
  getWithPeopleParams,
  FilterLink,
} from './links';
import PersonIcon from './people/icon';
import ItemLink from './people/item-link';

import { FnSetLimit } from '../hooks/use-limited-query';

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
  ref?: RefObject<HTMLElement>;
  role?: Role;
  setLimit: FnSetLimit;
}

interface AffiliatedPersonProps {
  item: AffiliatedPersonRecord;
  personRole?: Role;
  role?: Role;
}

const AffiliatedPerson = ({ item, personRole, role }: AffiliatedPersonProps) => {
  const person = useGetPersonById(item.person.id);

  if (!person) return null;

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
          <FilterLink newParams={getWithPeopleParams(person, personRole, role)} hasIcon>
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
  ref,
  role,
  setLimit,
}: Props) => (
  <AffiliatedItemTable
    initialCount={initialCount}
    label={model}
    ref={ref}
    setLimit={setLimit}
    title={attendees.label}
    total={attendees.total}
  >
    {(showAll) => {
      const items = showAll ? attendees.records : attendees.records.slice(0, initialCount);

      return items.map((item, i) => (
        <AffiliatedPerson
          item={item}
          key={i}
          personRole={attendees.role}
          role={role}
        />
      ));
    }}
  </AffiliatedItemTable>
);

export default AffiliatedPeopleTable;
