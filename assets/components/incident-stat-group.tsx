import React, { ReactNode } from 'react';
import { cx, css } from '@emotion/css';

import StatGroup from './stat-group';

const styles = css`
  .activity-stat {
    &.has-icon {
      .icon {
        color: var(--color-accent-alt-lighter);
      }
    }
  }

  .activity-stat + .activity-stat {
    margin-top: 9px;
  }

  .activity-stat-titles {
    color: var(--color-accent-darker);
    font-size: 12px;
    line-height: 21px;
  }

  .activity-stat-title {
    font-weight: 600;
  }

  .activity-stat-value {
    font-size: 14px;
    line-height: 21px;
  }

  a {
    color: var(--color-link);
  }
`;

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
    className={cx('incident-stat-group', styles, className)}
    title={title}
  >
    {children}
  </StatGroup>
);

export default IncidentStatGroup;
