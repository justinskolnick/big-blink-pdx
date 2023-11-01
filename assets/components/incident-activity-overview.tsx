import React, { ReactNode } from 'react';
import { cx, css } from '@emotion/css';

import DateBox from './incident-date-box';
import IncidentStatGroup from './incident-stat-group';
import IncidentCountBox from './stat-box-incident-count';
import NumbersGroup from './stat-group-numbers';
import StatGroup from './stat-group';
import StatSection from './stat-section';

import type { IncidentsOverview } from '../types';

const styles = css`
  .item-subhead {
    height: 27px;
  }

  .item-subhead + .activity-stat-group {
    margin-top: var(--gap);
  }

  .activity-numbers-and-dates {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: calc(100% - 27px - var(--gap));
  }

  .activity-stat-action {
    cursor: pointer;
    transition: box-shadow 250ms ease,
                transform 250ms ease;

    &:hover {
      box-shadow: 0 1px 4px var(--color-accent-alt-lighter);
      transform: scale(1.05);
      transition-timing-function: cubic-bezier(0.32, 2, 0.55, 0.27);
    }

    &:active {
      transform: scale(0.95);
    }
  }

  .activity-numbers + .activity-dates {
    margin-top: var(--gap);
  }

  @media screen and (min-width: 813px) {
    display: grid;
    grid-template-columns: 3fr 5fr;
    grid-column-gap: var(--gap);
  }

  @media screen and (max-width: 812px) {
    .item-subhead + .activity-stat-group,
    .activity-stat-group + .activity-stat {
      margin-top: var(--gap);
    }

    .activity-stat-section + .activity-stat-section {
      margin-top: var(--gap);
    }
  }
`;

interface Props {
  children: ReactNode;
  incidents: IncidentsOverview;
  scrollToRef: () => void;
}

const ActivityOverview = ({
  children,
  incidents,
  scrollToRef,
}: Props) => (
  <div className={cx('activity-overview', styles)}>
    <StatSection title='Overview' stylized={false}>
      <StatGroup className='activity-numbers-and-dates'>
        <NumbersGroup>
          <IncidentCountBox title='Percent of total'>
            {incidents.stats.percentage}%
          </IncidentCountBox>
          <IncidentCountBox
            onClick={scrollToRef}
            title='Incidents'
            className='activity-stat-action'
          >
            {incidents.stats.total}
          </IncidentCountBox>
        </NumbersGroup>

        <IncidentStatGroup className='activity-dates'>
          <DateBox incident={incidents.stats.first} />
          <DateBox incident={incidents.stats.last} />
        </IncidentStatGroup>
      </StatGroup>
    </StatSection>

    <StatSection stylized={false}>
      {children}
    </StatSection>
  </div>
);

export default ActivityOverview;
