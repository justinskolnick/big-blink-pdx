import React from 'react';

import Section from '../leaderboard/section';
import EntitiesLeaderboard from '../leaderboard/leaderboard-entities';
import LobbyistsLeaderboard from '../leaderboard/leaderboard-lobbyists';
import OfficialsLeaderboard from '../leaderboard/leaderboard-officials';

import useSelector from '../../hooks/use-app-selector';

import { getHasSourcesChartData } from '../../selectors';

import type { Ref } from '../../types';

interface Props {
  ref?: Ref;
}

const Leaderboard = ({ ref }: Props) => {
  const hasChartData = useSelector(getHasSourcesChartData);

  const isReady = hasChartData;

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
