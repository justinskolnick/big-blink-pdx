import React from 'react';

import Icon from './icon';
import ItemLink from './item-link';
import { ItemRow } from '../item-table';

import { useGetEntityById } from '../../reducers/entities';

import type { Id } from '../../types';

interface Props {
  id: Id;
}

export const Item = ({ id }: Props) => {
  const entity = useGetEntityById(id);
  const percentage = entity?.overview?.totals?.values?.percentage?.value;
  const total = entity?.overview?.totals?.values?.total?.value;

  const hasEntity = Boolean(entity);
  const hasTotal = Boolean(total);

  if (!hasEntity) return null;

  return (
    <ItemRow
      icon={<Icon />}
      name={(
        hasTotal ? (
          <ItemLink item={entity}>{entity.name}</ItemLink>
        ) : (
          entity.name
        )
      )}
      percentage={percentage ?? <>-</>}
      total={total ?? <>-</>}
    />
  );
};

export default Item;
