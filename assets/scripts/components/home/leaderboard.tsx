import React from 'react';

import LeaderboardSection from '../leaderboard/section';
import EntitiesLeaderboard from '../leaderboard/leaderboard-entities';
import LobbyistsLeaderboard from '../leaderboard/leaderboard-lobbyists';
import OfficialsLeaderboard from '../leaderboard/leaderboard-officials';

const Leaderboard = () => (
  <LeaderboardSection>
    <EntitiesLeaderboard />
    <LobbyistsLeaderboard />
    <OfficialsLeaderboard />
  </LeaderboardSection>
);

export default Leaderboard;
