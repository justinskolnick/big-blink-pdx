import React, { ReactNode } from 'react';
import { cx } from '@emotion/css';

import StatGroup from './stat-group';

interface Props {
  children: ReactNode;
  className?: string;
  description?: string | ReactNode;
  subtitle?: string | ReactNode;
  title?: string | ReactNode;
}

const IncidentActivityGroup = ({
  children,
  className,
  description,
  subtitle,
  title,
}: Props) => (
  <StatGroup
    className={cx('incident-activity-stat-group', className)}
    subtitle={subtitle}
    title={title}
    description={description}
  >
    {children}
  </StatGroup>
);

export default IncidentActivityGroup;
