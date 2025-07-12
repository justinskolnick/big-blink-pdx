import React, { RefObject } from 'react';
import { useSelector } from 'react-redux';

import Section from '../leaderboard/section';
import EntitiesLeaderboard from '../leaderboard/leaderboard-entities';
import LobbyistsLeaderboard from '../leaderboard/leaderboard-lobbyists';
import OfficialsLeaderboard from '../leaderboard/leaderboard-officials';

import {
  getHasLeaderboardData,
  getHasSourcesChartData,
} from '../../selectors';

interface Props {
  ref?: RefObject<HTMLElement>
}

const Leaderboard = ({ ref }: Props) => {
  const hasChartData = useSelector(getHasSourcesChartData);
  const hasLeaderboardData = useSelector(getHasLeaderboardData);

  const isReady = hasChartData && hasLeaderboardData;

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
