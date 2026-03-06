import React, { ReactNode } from 'react';
import { cx } from '@emotion/css';

interface Props {
  children: ReactNode;
  className?: string;
}

const ItemText = ({ children, className }: Props) => (
  <span className={cx('item-text', className)}>{children}</span>
);

export default ItemText;
