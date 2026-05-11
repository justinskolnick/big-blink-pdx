import React, { useEffect } from 'react';
import { useLocation } from 'react-router';

import Section from './leaderboard/section';
import EntitiesLeaderboard from './leaderboard/leaderboard-entities';
import LobbyistsLeaderboard from './leaderboard/leaderboard-lobbyists';
import OfficialsLeaderboard from './leaderboard/leaderboard-officials';

import useSelector from '../../hooks/use-app-selector';

import { getHasSourcesChartData } from '../../selectors';

import api from '../../services/api';

import type { Ref } from '../../types';

interface Props {
  ref?: Ref;
}

const Leaderboard = ({ ref }: Props) => {
  const [triggerLeaderboard, leaderboardResult] = api.useLazyGetLeaderboardQuery();

  const location = useLocation();

  const hasChartData = useSelector(getHasSourcesChartData);

  const isReady = hasChartData;

  useEffect(() => {
    if (leaderboardResult.isUninitialized) {
      triggerLeaderboard({ search: location.search });
    }
  }, [
    leaderboardResult,
    triggerLeaderboard,
  ]);

  return (
    <Section ref={ref}>
      {isReady && (
        <>
          <EntitiesLeaderboard />
          <LobbyistsLeaderboard />
          <OfficialsLeaderboard />
        </>
      )}
    </Section>
  );
};

export default Leaderboard;
