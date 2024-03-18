import React, { ReactNode } from 'react';
import { cx } from '@emotion/css';

interface Props {
  children: ReactNode;
  className?: string;
}

const ItemDescription = ({ children, className }: Props) => (
  <div className={cx('item-description', className)}>
    {children}
  </div>
);

export default ItemDescription;
