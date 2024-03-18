import React, { ReactNode } from 'react';
import { cx } from '@emotion/css';

import StatBox from './stat-box';

interface Props {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  title: string;
}

const IncidentCountBox = ({
  children,
  className,
  onClick,
  title,
}: Props) => (
  <StatBox
    className={cx(
      'activity-stat-incident-count',
      onClick && 'is-interactive',
      className,
    )}
    onClick={onClick}
    title={title}
  >
    {children}
  </StatBox>
);

export default IncidentCountBox;
