import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { cx, css } from '@emotion/css';

import fetchFromPath from '../../lib/fetch-from-path';
import { RootState } from '../../lib/store';

import Icon from '../icon';
import { LinkToSource } from '../links';

import { selectors } from '../../reducers/sources';

import type { Id } from '../../types';

const styles = css`
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  overflow: hidden;
  border-radius: 9px;
  border: 1px solid var(--color-blue);

  .item-source-quarter-icon,
  .item-source-quarter-description {
    padding: 12px 18px;
  }

  .item-source-quarter-icon {
    display: flex;
    align-items: center;
    background-color: var(--color-light-blue);
    color: var(--color-blue);

    .icon {
      font-size: 14px;
    }
  }

  .item-source-quarter-description {
    width: 100%;

    h6 {
      color: var(--color-black);
      line-height: 18px;
    }

    p {
      color: var(--color-gray);
      font-size: 12px;
      line-height: 18px;
    }
  }

  @media screen and (min-width: 901px) {
    .item-source-quarter-description {
      display: flex;
      justify-content: space-between;
    }
  }

  @media screen and (min-width: 781px) and (max-width: 900px) {
    .item-source-quarter-description {
      h6 + p {
        margin-top: 3px;
      }
    }
  }

  @media screen and (min-width: 451px) and (max-width: 780px) {
    .item-source-quarter-description {
      display: flex;
      justify-content: space-between;
    }
  }

  @media screen and (max-width: 450px) {
    .item-source-quarter-description {
      h6 + p {
        margin-top: 3px;
      }
    }
  }
`;

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
      className={cx('item-source-quarter', styles)}
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
