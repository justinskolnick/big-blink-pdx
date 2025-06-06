import React, { ReactNode } from 'react';
import { cx } from '@emotion/css';

import Icon from './icon';
import ItemSubsection from './item-subsection';
import StatGroup from './stat-group';

import { IconName } from '@fortawesome/fontawesome-svg-core';

interface Props {
  children?: ReactNode;
  className?: string;
  icon?: IconName;
  title?: string | ReactNode;
}

export const IncidentActivityGroup = ({
  children,
  className,
  icon,
  title,
}: Props) => {
  const hasIcon = Boolean(icon);

  return (
    <StatGroup
      className={cx('incident-activity-stat-group', className)}
      subtitle={
        <>
          {hasIcon && <Icon name={icon} />}
          <span className='item-text'>{title}</span>
        </>
      }
    >
      {children && <ItemSubsection>{children}</ItemSubsection>}
    </StatGroup>
  );
};

export default IncidentActivityGroup;
