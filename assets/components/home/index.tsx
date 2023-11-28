import React from 'react';
import { css } from '@emotion/css';

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
  <Section
    icon='chart-simple'
    title='Lobbying in Portland, Oregon'
    className={styles}
  >
    <Chart />
    <EntitiesLeaderboard />
    <LobbyistsLeaderboard />
    <OfficialsLeaderboard />
  </Section>
);

export default Home;
