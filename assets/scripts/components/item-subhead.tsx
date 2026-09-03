import React, { ReactNode } from 'react';
import { cx } from '@emotion/css';

import { IconName } from '@fortawesome/fontawesome-svg-core';

import Icon from './icon';

interface Props {
  children?: ReactNode;
  className?: string;
  hasBorder?: boolean;
  icon?: IconName;
  title?: string | ReactNode;
  subtitle?: string | ReactNode;
}

const ItemSubhead = ({
  children,
  className,
  hasBorder,
  icon,
  title,
  subtitle,
}: Props) => (
  <header
    className={cx(
      'item-subhead',
      hasBorder && 'has-border',
      icon && 'has-icon',
      className
    )}
  >
    {icon && <Icon name={icon} className='item-subhead-icon' />}
    <div className='item-subhead-content'>
      <div className='item-subhead-content-title'>
        {title && <h4>{title}</h4>}
        {subtitle && <h5>{subtitle}</h5>}
      </div>
      {children}
    </div>
  </header>
);

export default ItemSubhead;
