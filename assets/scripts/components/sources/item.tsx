import React, { useEffect } from 'react';

import Icon from './icon';
import ItemLink from './item-link';

import { useGetSourceById } from '../../reducers/sources';
import api from '../../services/api';

import type { Id } from '../../types';

interface Props {
  id: Id;
}

const Item = ({ id }: Props) => {
  const [trigger] = api.useLazyGetSourceByIdQuery();

  const source = useGetSourceById(id);

  const hasSource = Boolean(source);
  const hasTotals = Boolean(source?.overview?.totals.values.total.value);

  useEffect(() => {
    if (source) return;

    trigger({ id });
  }, [id, source, trigger]);

  if (!hasSource) return null;

  return (
    <ItemLink item={source} className='item-source-quarter'>
      <div className='item-source-quarter-icon'>
        <Icon />
      </div>

      <div className='item-source-quarter-description'>
        <h6>{source.title}</h6>
        {hasTotals && (
          <p>{source?.overview?.totals.values.total.value} incidents</p>
        )}
      </div>
    </ItemLink>
  );
};

export default Item;
