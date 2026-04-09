import React, { useEffect } from 'react';

import Icon from './icon';
import ItemLink from './item-link';

import { useGetSourceById } from '../../reducers/sources';
import api from '../../services/api';

import type { Id, SourceObject } from '../../types';

interface ItemProps {
  source: SourceObject;
}

interface Props {
  id: Id;
}

const ActivityItem = ({ source }: ItemProps) => {
  const total = source.overview?.totals?.values?.total?.value;
  const hasTotals = Boolean(total);

  return (
    <div className='item-source-quarter-description'>
      <h6>{source.title}</h6>
      {hasTotals && (
        <p>{total} incidents</p>
      )}
    </div>
  );
};

const OtherItem = ({ source }: ItemProps) => (
  <div className='item-source-quarter-description'>
    <h6>{source.title}</h6>
  </div>
);

const Item = ({ id }: Props) => {
  const [trigger] = api.useLazyGetSourceByIdQuery();

  const source = useGetSourceById(id);
  const hasSource = Boolean(source);

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

      {source.type === 'activity' ? (
        <ActivityItem source={source} />
      ) : (
        <OtherItem source={source} />
      )}
    </ItemLink>
  );
};

export default Item;
