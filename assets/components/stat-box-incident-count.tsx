import React, { ReactNode } from 'react';
import { cx, css } from '@emotion/css';

import StatBox from './stat-box';

interface Props {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  title: string;
}

const styles = css`
  background-color: var(--color-stat-light);
  border: 1px solid var(--color-accent-alt-lighter);

  .activity-stat-titles {
    color: var(--color-stat-label);
  }

  .activity-stat-value {
    color: var(--color-stat);
  }

  &.is-interactive {
    box-shadow: 0 1px 1px var(--color-accent-alt-lighter);

    .activity-stat-value {
      color: var(--color-link);
    }
  }
`;

const IncidentCountBox = ({
  children,
  className,
  onClick,
  title,
}: Props) => (
  <StatBox
    className={cx(
      styles,
      onClick && 'is-interactive',
      className
    )}
    onClick={onClick}
    title={title}
  >
    {children}
  </StatBox>
);

export default IncidentCountBox;
