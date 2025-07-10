import React from 'react';
import { useSelector } from 'react-redux';

import Chart from './chart';
import Leaderboard from './leaderboard';
import Section from '../section';

import {
  getHasLeaderboardData,
  getHasSourcesChartData,
} from '../../selectors';

const Home = () => {
  const hasChartData = useSelector(getHasSourcesChartData);
  const hasLeaderboardData = useSelector(getHasLeaderboardData);

  return (
    <Section
      icon='handshake'
      title='Lobbying in Portland, Oregon'
      className='section-home'
    >
      {hasChartData && <Chart />}
      {hasChartData && hasLeaderboardData && <Leaderboard />}
    </Section>
  );
};

export default Home;
