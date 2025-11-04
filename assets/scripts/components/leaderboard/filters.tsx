import React from 'react';
import { useSelector } from 'react-redux';

import Filter, { Filters, FilterIntro } from '../filter';

import {
  getLeaderboardFilters,
  getLeaderboardLabels,
} from '../../selectors';

import { isEmpty } from '../../lib/util';

const LeaderboardFilters = () => {
  const filters = useSelector(getLeaderboardFilters);
  const labels = useSelector(getLeaderboardLabels);
  const hasFilters = !isEmpty(filters);

  if (!hasFilters) return null;

  return (
    <Filters>
      <FilterIntro>
        <h4>{labels.filters.intro}</h4>
      </FilterIntro>
      <Filter filter={filters.period} />
    </Filters>
  );
};

export default LeaderboardFilters;
