import React from 'react';
import { useSelector } from 'react-redux';

import { getLeaderboardEntitiesValues } from '../../selectors';

import LeaderboardRankings from './rankings';

import { Sections } from '../../types';

const EntitiesLeaderboard = () => {
  const result = useSelector(getLeaderboardEntitiesValues);

  return (
    <LeaderboardRankings
      isGrid
      rankings={result}
      section={Sections.Entities}
    />
  );
};

export default EntitiesLeaderboard;
