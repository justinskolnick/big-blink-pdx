import React, { ReactNode } from 'react';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { cx } from '@emotion/css';

import StatSection from './stat-section';

import type { Ref } from '../types';

interface Props {
  children: ReactNode;
  className?: string;
  description?: string | ReactNode;
  icon?: IconName;
  ref?: Ref;
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
