import React from 'react';
import { useSelector } from 'react-redux';

import { getPeopleLeaderboard } from '../../selectors';

import LeaderboardRankings from '../leaderboard/rankings';

import { Sections } from '../../types';

const LobbyistsLeaderboard = () => {
  const result = useSelector(getPeopleLeaderboard);

  return (
    <LeaderboardRankings
      isGrid
      rankings={result?.lobbyists}
      section={Sections.People}
    />
  );
};

export default LobbyistsLeaderboard;
