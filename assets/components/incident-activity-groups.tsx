import React, { ReactNode } from 'react';
import { cx, css } from '@emotion/css';

import StatSection from './stat-section';

const styles = css`
  h5 {
    display: flex;
    line-height: 27px;
  }

  .activity-stat-group + .activity-stat-group {
    margin-top: calc(var(--gap) * 3);
  }

  @media screen and (min-width: 813px) {
    display: grid;
    grid-gap: var(--gap);
    grid-template-columns: 1fr 3fr;
  }

  @media screen and (max-width: 812px) {
    .item-subhead + .incident-activity-stat-groups-list {
      margin-top: var(--gap);
    }
  }
`;

interface Props {
  children: ReactNode;
  className?: string;
  description?: string | ReactNode;
  title?: string | ReactNode;
}

const IncidentActivityGroups = ({
  children,
  className,
  description,
  title,
}: Props) => (
  <StatSection
    className={cx('incident-activity-stat-groups', styles, className)}
    title={title}
    description={description}
  >
    <div className='incident-activity-stat-groups-list'>
      {children}
    </div>
  </StatSection>
);

export default IncidentActivityGroups;
