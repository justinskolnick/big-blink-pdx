import React from 'react';
import { cx, css } from '@emotion/css';

import StatSection from './stat-section';

import type { ChildContainerProps } from '../types';

const styles = css`
  .item-subhead + .activity-stat-group {
    margin-top: 0;
  }

  .activity-numbers-and-dates {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .activity-numbers + .activity-dates {
    margin-top: var(--gap);
  }

  @media screen and (min-width: 813px) {
    display: grid;
    grid-template-columns: 3fr 5fr;
    grid-template-rows: 1fr 10fr;
    grid-column-gap: 18px;
    grid-row-gap: 18px;

    .item-subhead { grid-area: 1 / 1 / 2 / 2; }
    .activity-numbers-and-dates { grid-area: 2 / 1 / 3 / 2; }
    .activity-chart { grid-area: 1 / 2 / 3 / 3; } 
  }

  @media screen and (max-width: 812px) {
    .item-subhead + .activity-stat-group,
    .activity-stat-group + .activity-stat {
      margin-top: var(--gap);
    }
  }
`;

const ActivityOverview = ({ children }: ChildContainerProps) => (
  <StatSection
    className={cx('activity-overview', styles)}
    title='Overview'
    stylized={false}
  >
    {children}
  </StatSection>
);

export default ActivityOverview;
