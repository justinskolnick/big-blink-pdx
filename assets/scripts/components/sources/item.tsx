import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../lib/store';

import Icon from '../icon';
import { LinkToSource } from '../links';

import { selectors } from '../../reducers/sources';
import api from '../../services/api';

import type { Id } from '../../types';

interface Props {
  id: Id;
}

const Source = ({ id }: Props) => {
  const [trigger] = api.useLazyGetSourceByIdQuery();

  const source = useSelector((state: RootState) => selectors.selectById(state, id));
  const hasTotals = Boolean(source?.overview?.totals.values.total.value);

  useEffect(() => {
    if (source) return;

    trigger(id);
  }, [id, source, trigger]);

  if (!source) return null;

  return (
    <LinkToSource
      className='item-source-quarter'
      id={source.id}
      key={`${source.year}-${source.quarter}`}
    >
      <div className='item-source-quarter-icon'>
        <Icon name='database' />
      </div>

      <div className='item-source-quarter-description'>
        <h6>{source.title}</h6>
        {hasTotals && (
          <p>{source?.overview?.totals.values.total.value} incidents</p>
        )}
      </div>
    </LinkToSource>
  );
};

export default Source;
