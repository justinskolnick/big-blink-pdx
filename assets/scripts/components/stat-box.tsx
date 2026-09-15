import React, { ReactNode } from 'react';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { cx } from '@emotion/css';

import Icon from './icon';
import ItemSubhead from './item-subhead';

import type { ClassNames } from '../types';

interface Props {
  children: string | number | ReactNode;
  className?: ClassNames;
  icon?: IconName;
  onClick?: () => void;
  title: string;
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
  >
    {icon && <Icon name={icon} />}
    <div className='activity-stat-content'>
      {title && (
        <ItemSubhead subsubtitle={title} />
      )}
      <div
        className='activity-stat-value'
        onClick={onClick}
      >
        {children}
      </div>
    </div>
  </div>
);

export default StatBox;
