import React from 'react';
import { useSelector } from 'react-redux';

import useFetchAndScrollOnRouteChange from '../../hooks/use-fetch-and-scroll-on-route-change';

import ItemSubhead from '../item-subhead';
import SectionIndex from '../section-index';
import Source from './item';

import { getSourcesByYear } from '../../selectors';

const Index = () => {
  const byYear = useSelector(getSourcesByYear);
  const hasSources = byYear.length > 0;

  useFetchAndScrollOnRouteChange();

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
