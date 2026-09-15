import React, { PropsWithChildren, ReactNode } from 'react';
import { cx } from '@emotion/css';

import { IconName } from '@fortawesome/fontawesome-svg-core';

import Icon from './icon';

import type { LinkTo } from '../types';

interface ItemSubheadIconProps {
  name: IconName;
  title?: string;
  to?: LinkTo;
}

interface Props extends PropsWithChildren {
  className?: string;
  hasBorder?: boolean;
  icon?: IconName;
  iconTo?: LinkTo;
  title?: string | ReactNode;
  subtitle?: string | ReactNode;
  subsubtitle?: string | ReactNode;
}

export const ItemSubheadIcon = ({ name, title, to }: ItemSubheadIconProps) => (
  <Icon name={name} title={title} to={to} className='item-subhead-icon' />
);

const ItemSubhead = ({
  children,
  className,
  hasBorder,
  icon,
  iconTo,
  title,
  subtitle,
  subsubtitle,
}: Props) => (
  <header
    className={cx(
      'item-subhead',
      hasBorder && 'has-border',
      icon && 'has-icon',
      className
    )}
  >
    {icon && <ItemSubheadIcon name={icon} to={iconTo} />}
    <div className='item-subhead-content'>
      <div className='item-subhead-content-title'>
        {title && <h4>{title}</h4>}
        {subtitle && <h5>{subtitle}</h5>}
        {subsubtitle && <h6>{subsubtitle}</h6>}
      </div>
      {children}
    </div>
  </header>
);

export default ItemSubhead;
