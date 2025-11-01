import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import { getLeaderboardOfficialsValues } from '../../selectors';

import api from '../../services/api';

import LeaderboardRankings from './rankings';

import { Sections } from '../../types';

const OfficialsLeaderboard = () => {
  const [trigger] = api.useLazyGetLeaderboardOfficialsQuery();
  const result = useSelector(getLeaderboardOfficialsValues);
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

export default OfficialsLeaderboard;
