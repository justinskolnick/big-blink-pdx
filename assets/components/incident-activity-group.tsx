import React, { ReactNode } from 'react';
import { cx } from '@emotion/css';

import Icon from './icon';
import StatGroup from './stat-group';

import { IconName } from '@fortawesome/fontawesome-svg-core';

interface Props {
  children: ReactNode;
  className?: string;
  icon: IconName;
  title?: string | ReactNode;
}

export const IncidentActivityGroup = ({
  children,
  className,
  icon,
  title,
}: Props) => (
  <StatGroup
    className={cx('incident-activity-stat-group', className)}
    subtitle={
      <>
        <Icon name={icon} />
        <span className='item-text'>{title}</span>
      </>
    }
  >
    <div className='item-subsection'>{children}</div>
  </StatGroup>
);

export default IncidentActivityGroup;
