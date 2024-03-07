import React, { ReactNode } from 'react';
import { cx } from '@emotion/css';

interface Props {
  children?: ReactNode;
  className?: string;
  hasBorder?: boolean;
  title?: string | ReactNode;
  subtitle?: string | ReactNode;
}

const ItemSubhead = ({
  children,
  className,
  hasBorder,
  title,
  subtitle,
}: Props) => (
  <header
    className={cx(
      'item-subhead',
      hasBorder && 'has-border',
      className
    )}
  >
    {title && <h4>{title}</h4>}
    {subtitle && <h5>{subtitle}</h5>}
    {children}
  </header>
);

export default ItemSubhead;
