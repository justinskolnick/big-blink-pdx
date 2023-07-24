import React, { ReactNode } from 'react';
import { cx, css } from '@emotion/css';

import StatGroup from './stat-group';

interface Props {
  children: ReactNode;
  className?: string;
  title?: string | ReactNode;
}

const styles = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(144px, 1fr));
  grid-gap: var(--gap);

  .activity-stat {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 18px;
    border-radius: 9px;
  }

  .activity-stat-value {
    font-weight: 200;
    font-size: 32px;
  }

  .activity-stat-titles + .activity-stat-value {
    margin-top: 9px;
  }
`;

const NumbersGroup = ({
  children,
  className,
  title,
}: Props) => (
  <StatGroup
    className={cx('activity-numbers', styles, className)}
    title={title}
  >
    {children}
  </StatGroup>
);

export default NumbersGroup;
