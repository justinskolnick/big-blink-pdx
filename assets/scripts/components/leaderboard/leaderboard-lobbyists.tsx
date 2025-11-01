import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import { getLeaderboardLobbyistsValues } from '../../selectors';

import api from '../../services/api';

import LeaderboardRankings from './rankings';

import { Sections } from '../../types';

const LobbyistsLeaderboard = () => {
  const [trigger] = api.useLazyGetLeaderboardLobbyistsQuery();
  const result = useSelector(getLeaderboardLobbyistsValues);
  const location = useLocation();

  useEffect(() => {
    trigger({ search: location.search });
  }, [location, trigger]);

  return (
    <LeaderboardRankings
      isGrid
      rankings={result}
      section={Sections.People}
    />
  );
};

export default LobbyistsLeaderboard;
