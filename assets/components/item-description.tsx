import React, { ReactNode } from 'react';
import { css, cx } from '@emotion/css';

const styles = css`
  color: var(--color-text-light);
  font-size: 14px;
  line-height: 21px;
`;

interface Props {
  children: ReactNode;
  className?: string;
}

const ItemDescription = ({ children, className }: Props) => (
  <div className={cx('item-description', styles, className)}>
    {children}
  </div>
);

export default ItemDescription;
