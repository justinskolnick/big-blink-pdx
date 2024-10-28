import React, { ReactNode } from 'react';
import { cx } from '@emotion/css';

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
}: Props) => {
  const hasIcon = Boolean(icon);

  return (
    <header
      className={cx(
        'item-subhead',
        hasBorder && 'has-border',
        hasIcon && 'has-icon',
        className
      )}
    >
      {hasIcon && <Icon name={icon} />}
      <div className='item-subhead-content'>
        {title && <h4>{title}</h4>}
        {subtitle && <h5>{subtitle}</h5>}
        {children}
      </div>
    </header>
  );
};

export default ItemSubhead;
