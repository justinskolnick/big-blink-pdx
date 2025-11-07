import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import useLimitedQuery from '../../hooks/use-limited-query';

import { getLeaderboardEntitiesValues } from '../../selectors';

import api from '../../services/api';

import LeaderboardRankings from './rankings';

import { Sections } from '../../types';

const EntitiesLeaderboard = () => {
  const location = useLocation();
  const query = api.useLazyGetLeaderboardEntitiesQuery;

  const { setRecordLimit } = useLimitedQuery(query, {
    limit: 5,
    search: location.search,
  });

  const result = useSelector(getLeaderboardEntitiesValues);

  return (
    <LeaderboardRankings
      isGrid
      rankings={result}
      section={Sections.Entities}
      setLimit={setRecordLimit}
    />
  );
};

export default EntitiesLeaderboard;
