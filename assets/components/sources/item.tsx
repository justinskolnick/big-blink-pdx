import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import fetchFromPath from '../../lib/fetch-from-path';
import { RootState } from '../../lib/store';

import Icon from '../icon';
import { LinkToSource } from '../links';

import { selectors } from '../../reducers/sources';

import type { Id } from '../../types';

interface Props {
  id: Id;
}

const Source = ({ id }: Props) => {
  const fetched = useRef(false);
  const location = useLocation();

  const source = useSelector((state: RootState) => selectors.selectById(state, id));
  const hasIncidents = Boolean(source.incidents);

  useEffect(() => {
    if (source) return;

    if (!fetched.current) {
      fetchFromPath('/sources/' + id);
      fetched.current = true;
    }
  }, [fetched, location, id, source]);

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
        {hasIncidents && (
          <p>{source.incidents?.stats.total} incidents</p>
        )}
      </div>
    </LinkToSource>
  );
};

export default Source;
