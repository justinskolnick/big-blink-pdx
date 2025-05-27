import React from 'react';
import { useSelector } from 'react-redux';

import { getLeaderboardOfficialsValues } from '../../selectors';

import LeaderboardRankings from './rankings';

import { Sections } from '../../types';

const OfficialsLeaderboard = () => {
  const result = useSelector(getLeaderboardOfficialsValues);

  return (
    <LeaderboardRankings
      isGrid
      rankings={result}
      section={Sections.People}
    />
  );
};

export default OfficialsLeaderboard;
