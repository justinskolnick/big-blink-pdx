import React from 'react';
import { useSelector } from 'react-redux';

import { getEntitiesLeaderboard } from '../../selectors';

import LeaderboardRankings from '../leaderboard/rankings';

import { Sections } from '../../types';

const EntitiesLeaderboard = () => {
  const result = useSelector(getEntitiesLeaderboard);

  return (
    <LeaderboardRankings
      isGrid
      rankings={result?.all}
      section={Sections.Entities}
    />
  );
};

export default EntitiesLeaderboard;
