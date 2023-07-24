import React from 'react';
import { css, cx } from '@emotion/css';

import Chart from './chart';
import EntitiesLeaderboard from './leaderboard-entities';
import LobbyistsLeaderboard from './leaderboard-lobbyists';
import OfficialsLeaderboard from './leaderboard-officials';
import Section from '../section';

const styles = css`
  .welcome-section + .welcome-section {
    margin-top: calc(3 * var(--gap));
  }
`;

const Home = () => (
  <div className={cx('welcome', styles)}>
    <Section
      className='welcome-section'
      icon='chart-simple'
      title='Lobbying activity over time'
    >
      <Chart />
    </Section>

    <Section
      className='welcome-section'
      icon='trophy'
      title='Leaderboard'
    >
      <EntitiesLeaderboard />
      <LobbyistsLeaderboard />
      <OfficialsLeaderboard />
    </Section>
  </div>
);

export default Home;
