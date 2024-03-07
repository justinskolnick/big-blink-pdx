import React, { ReactNode } from 'react';
import { cx } from '@emotion/css';

import StatSection from './stat-section';

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
    className={cx('incident-activity-stat-groups', className)}
    title={title}
    description={description}
  >
    <div className='incident-activity-stat-groups-list'>
      {children}
    </div>
  </StatSection>
);

export default IncidentActivityGroups;
