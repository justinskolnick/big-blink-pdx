import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import useLimitedQuery from '../../hooks/use-limited-query';

import { getLeaderboardLobbyistsValues } from '../../selectors';

import api from '../../services/api';

import LeaderboardRankings from './rankings';

import { Sections } from '../../types';

const LobbyistsLeaderboard = () => {
  const location = useLocation();
  const query = api.useLazyGetLeaderboardLobbyistsQuery;

  const { setRecordLimit } = useLimitedQuery(query, {
    limit: 5,
    search: location.search,
  });

  const result = useSelector(getLeaderboardLobbyistsValues);

  return (
    <LeaderboardRankings
      isGrid
      rankings={result}
      section={Sections.People}
      setLimit={setRecordLimit}
    />
  );
};

export default LobbyistsLeaderboard;
