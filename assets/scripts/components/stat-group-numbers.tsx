import React, { ReactNode } from 'react';
import { cx } from '@emotion/css';

import StatGroup from './stat-group';

interface Props {
  children: ReactNode;
  className?: string;
  title?: string | ReactNode;
}

const NumbersGroup = ({
  children,
  className,
  title,
}: Props) => (
  <StatGroup
    className={cx('activity-numbers', className)}
    title={title}
  >
    {children}
  </StatGroup>
);

export default NumbersGroup;
