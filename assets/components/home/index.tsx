import React from 'react';
import { css, cx } from '@emotion/css';

import Chart from './chart';
import EntitiesLeaderboard from './leaderboard-entities';
import LobbyistsLeaderboard from './leaderboard-lobbyists';
import OfficialsLeaderboard from './leaderboard-officials';
import Section from '../section';

const styles = css`
  .item-overview-chart + .leaderboard-subsection {
    margin-top: calc(3 * var(--gap));
  }

  @media screen and (max-width: 600px) {
    .section {
      .section-header-title {
        h2 {
          font-size: 24px;
        }
      }
    }
  }
`;

const Home = () => (
  <div className={cx('welcome', styles)}>
    <Section
      icon='chart-simple'
      title='Lobbying activity over time'
    >
      <Chart />
      <EntitiesLeaderboard />
      <LobbyistsLeaderboard />
      <OfficialsLeaderboard />
    </Section>
  </div>
);

export default Home;
