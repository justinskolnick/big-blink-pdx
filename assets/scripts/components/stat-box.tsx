import React, { ReactNode } from 'react';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { cx } from '@emotion/css';

import Icon from './icon';

interface Props {
  children: ReactNode;
  className?: string;
  icon?: IconName;
  onClick?: () => void;
  title?: string;
}

const StatBox = ({
  children,
  className,
  icon,
  onClick,
  title,
}: Props) => (
  <div
    className={cx(
      'activity-stat',
      className,
      icon && 'has-icon',
    )}
    onClick={onClick}
  >
    {icon && <Icon name={icon} />}
    <div className='activity-stat-content'>
      {title && (
        <h6 className='activity-stat-titles'>
          {title && (
            <span className='activity-stat-title'>
              {title}
            </span>
          )}
        </h6>
      )}
      <div className='activity-stat-value'>
        {children}
      </div>
    </div>
  </div>
);

export default StatBox;
