import React, { ReactNode } from 'react';
import { cx } from '@emotion/css';

interface Props {
  children: ReactNode;
  className?: string;
}

const ItemDetail = ({ children, className }: Props) => (
  <section className={cx('item-detail', className)}>
    {children}
  </section>
);

export default ItemDetail;
