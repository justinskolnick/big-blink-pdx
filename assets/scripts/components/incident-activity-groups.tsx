import React, { ReactNode, RefObject } from 'react';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { cx } from '@emotion/css';

import StatSection from './stat-section';

interface Props {
  children: ReactNode;
  className?: string;
  description?: string | ReactNode;
  icon?: IconName;
  ref?: RefObject<HTMLElement>;
  title?: string | ReactNode;
}

const IncidentActivityGroups = ({
  children,
  className,
  description,
  icon,
  ref,
  title,
}: Props) => (
  <StatSection
    className={cx('incident-activity-stat-groups', className)}
    icon={icon}
    title={title}
    description={description}
    ref={ref}
    stylized
  >
    <div className='incident-activity-stat-groups-list'>
      {children}
    </div>
  </StatSection>
);

export default IncidentActivityGroups;
