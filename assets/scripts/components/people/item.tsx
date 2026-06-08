import React from 'react';

import Icon from './icon';
import ItemLink from './item-link';
import { ItemRow } from '../item-table';

import { useGetPersonById } from '../../reducers/people';

import type { Id } from '../../types';

interface Props {
  id: Id;
}

export const Item = ({ id }: Props) => {
  const person = useGetPersonById(id);
  const percentage = person?.overview?.totals?.values?.percentage?.value;
  const total = person?.overview?.totals?.values?.total?.value;

  const hasPerson = Boolean(person);
  const hasTotal = Boolean(total);

  if (!hasPerson) return null;

  return (
    <ItemRow
      icon={<Icon person={person} />}
      name={(
        hasTotal ? (
          <ItemLink item={person}>{person.name}</ItemLink>
        ) : (
          person.name
        )
      )}
      percentage={percentage ?? <>-</>}
      total={total ?? <>-</>}
    />
  );
};

export default Item;
