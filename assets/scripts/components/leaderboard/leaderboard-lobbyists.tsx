import React from 'react';
import { useSelector } from 'react-redux';

import { getLeaderboardLobbyistsValues } from '../../selectors';

import LeaderboardRankings from './rankings';

import { Sections } from '../../types';

const LobbyistsLeaderboard = () => {
  const result = useSelector(getLeaderboardLobbyistsValues);

  return (
    <LeaderboardRankings
      isGrid
      rankings={result}
      section={Sections.People}
    />
  );
};

export default LobbyistsLeaderboard;
