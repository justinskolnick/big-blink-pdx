import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import { getLeaderboardEntitiesValues } from '../../selectors';

import api from '../../services/api';

import LeaderboardRankings from './rankings';

import { Sections } from '../../types';

const EntitiesLeaderboard = () => {
  const [trigger] = api.useLazyGetLeaderboardEntitiesQuery();
  const result = useSelector(getLeaderboardEntitiesValues);
  const location = useLocation();

  useEffect(() => {
    trigger({ search: location.search });
  }, [location, trigger]);

  return (
    <LeaderboardRankings
      isGrid
      rankings={result}
      section={Sections.Entities}
    />
  );
};

export default EntitiesLeaderboard;
