import React from 'react';
import { useSelector } from 'react-redux';

import Filter, { Filters, FilterIntro, FilterText } from '../filter';

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
        <FilterText>{labels.filters.intro}</FilterText>
      </FilterIntro>
      <Filter filter={filters.quarter} />
    </Filters>
  );
};

export default LeaderboardFilters;
