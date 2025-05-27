import React from 'react';

import EntitiesLeaderboard from '../leaderboard/leaderboard-entities';
import LobbyistsLeaderboard from '../leaderboard/leaderboard-lobbyists';
import OfficialsLeaderboard from '../leaderboard/leaderboard-officials';

const Leaderboard = () => (
  <>
    <EntitiesLeaderboard />
    <LobbyistsLeaderboard />
    <OfficialsLeaderboard />
  </>
);

export default Leaderboard;
