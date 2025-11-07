import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import useLimitedQuery from '../../hooks/use-limited-query';

import { getLeaderboardOfficialsValues } from '../../selectors';

import api from '../../services/api';

import LeaderboardRankings from './rankings';

import { Sections } from '../../types';

const OfficialsLeaderboard = () => {
  const location = useLocation();
  const query = api.useLazyGetLeaderboardOfficialsQuery;

  const { setRecordLimit } = useLimitedQuery(query, {
    limit: 5,
    search: location.search,
  });

  const result = useSelector(getLeaderboardOfficialsValues);

  return (
    <LeaderboardRankings
      isGrid
      rankings={result}
      section={Sections.People}
      setLimit={setRecordLimit}
    />
  );
};

export default OfficialsLeaderboard;
