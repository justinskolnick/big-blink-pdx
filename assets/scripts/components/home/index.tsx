import React from 'react';

import Chart from './chart';
import Leaderboard from './leaderboard';
import Section from '../section';

const Home = () => (
  <Section
    icon='handshake'
    title='Lobbying in Portland, Oregon'
    className='section-home'
  >
    <Chart />
    <Leaderboard />
  </Section>
);

export default Home;
