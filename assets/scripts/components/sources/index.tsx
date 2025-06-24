import React from 'react';
import { useSelector } from 'react-redux';

import useFetchAndScrollOnRouteChange from '../../hooks/use-fetch-and-scroll-on-route-change';

import ItemSubhead from '../item-subhead';
import SectionIndex from '../section-index';
import Source from './item';

import { getSourcesByType } from '../../selectors';

const Index = () => {
  const byType = useSelector(getSourcesByType);

  const hasSources = byType.length > 0;

  useFetchAndScrollOnRouteChange();

  return (
    <SectionIndex isLoading={!hasSources}>
      {byType.map((type) => (
        <div key={type.type} className='item-index-group'>
          <ItemSubhead title={type.type} />
          {Object.values(type.years).map(year => (
            <div key={year.year} className='item-index-subgroup'>
              <ItemSubhead subtitle={year.year} />

              <div className='section-index-list'>
                {year.items.map(source => (
                  <Source key={source.id} id={source.id} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </SectionIndex>
  );
};

export default Index;
