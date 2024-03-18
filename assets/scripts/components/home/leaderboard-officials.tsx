import React from 'react';
import { useSelector } from 'react-redux';

import { getPeopleLeaderboard } from '../../selectors';

import LeaderboardRankings from '../leaderboard/rankings';

import { Sections } from '../../types';

const OfficialsLeaderboard = () => {
  const result = useSelector(getPeopleLeaderboard);

  return (
    <LeaderboardRankings
      isGrid
      rankings={result?.officials}
      section={Sections.People}
    />
  );
};

export default OfficialsLeaderboard;
