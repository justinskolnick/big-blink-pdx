import React, { ReactNode } from 'react';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { cx } from '@emotion/css';

import StatBox from './stat-box';

interface Props {
  children: ReactNode;
  className?: string;
  icon?: IconName;
  onClick?: () => void;
  title: string;
}

const IncidentCountBox = ({
  children,
  className,
  icon,
  onClick,
  title,
}: Props) => (
  <StatBox
    className={cx(
      onClick && 'is-interactive',
      className,
    )}
    onClick={onClick}
    title={title}
    icon={icon}
  >
    {children}
  </StatBox>
);

export default IncidentCountBox;
