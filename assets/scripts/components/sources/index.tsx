import React from 'react';
import { useSelector } from 'react-redux';

import { getSourcesByYear } from '../../selectors';

import ItemSubhead from '../item-subhead';
import SectionIndex from '../section-index';
import Source from './item';

const Index = () => {
  const byYear = useSelector(getSourcesByYear);
  const hasSources = byYear.length > 0;

  return (
    <SectionIndex isLoading={!hasSources}>
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
