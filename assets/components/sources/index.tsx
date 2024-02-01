import React from 'react';
import { useSelector } from 'react-redux';
import { css } from '@emotion/css';

import { getSourcesByYear } from '../../selectors';

import ItemSubhead from '../item-subhead';
import SectionIndex from '../section-index';
import Source from './item';

const styles = css`
  .item-subhead {
    color: var(--color-accent);
  }

  .item-subhead + .section-index-list {
    margin-top: 18px;
  }

  .item-index-group + .item-index-group {
    margin-top: 36px;
  }

  .section-index-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: calc(var(--gap) / 2);
  }

  @media screen and (max-width: 780px) {
    .section-index-list {
      grid-template-columns: 1fr;
    }
  }
`;

const Index = () => {
  const byYear = useSelector(getSourcesByYear);
  const hasSources = byYear.length > 0;

  return (
    <SectionIndex className={styles} isLoading={!hasSources}>
      {byYear.map(sources => (
          <div key={sources.year} className='item-index-group'>
            <ItemSubhead title={sources.year} />

            <div className='section-index-list'>
              {sources.items.map(source => (
                <Source key={source.id} id={source.id} />
              ))}
            </div>
          </div>
        ))}
    </SectionIndex>
  );
};

export default Index;
