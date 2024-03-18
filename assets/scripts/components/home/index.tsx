import React from 'react';

import Chart from './chart';
import EntitiesLeaderboard from './leaderboard-entities';
import LobbyistsLeaderboard from './leaderboard-lobbyists';
import OfficialsLeaderboard from './leaderboard-officials';
import Section from '../section';

const Home = () => (
  <Section
    icon='handshake'
    title='Lobbying in Portland, Oregon'
    className='section-home'
  >
    <Chart />
    <EntitiesLeaderboard />
    <LobbyistsLeaderboard />
    <OfficialsLeaderboard />
  </Section>
);

export default Home;
