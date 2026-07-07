import React, { useEffect } from 'react';

import useSelector from '../../hooks/use-app-selector';

import Icon from './icon';
import ItemLink from './item-link';

import { useGetSourceById } from '../../reducers/sources';

import { getLabels } from '../../selectors';

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

  const labels = useSelector(getLabels);

  return (
    <div className='item-source-description'>
      <h6>{source.title}</h6>
      {hasTotals && (
        <p>{total} {labels.incidents}</p>
      )}
    </div>
  );
};

const OtherItem = ({ source }: ItemProps) => (
  <div className='item-source-description'>
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
    <ItemLink item={source} className='item-source'>
      <div className='item-source-icon'>
        <Icon item={source} />
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
