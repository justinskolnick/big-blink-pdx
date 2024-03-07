import React, { ReactNode } from 'react';
import { cx } from '@emotion/css';

import StatGroup from './stat-group';

interface Props {
  children: ReactNode;
  className?: string;
  title?: string | ReactNode;
}

const IncidentStatGroup = ({
  children,
  className,
  title,
}: Props) => (
  <StatGroup
    className={cx('incident-stat-group', className)}
    title={title}
  >
    {children}
  </StatGroup>
);

export default IncidentStatGroup;
