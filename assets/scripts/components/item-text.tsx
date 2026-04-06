import React, { ReactNode } from 'react';
import { cx } from '@emotion/css';

import type { ClassNames } from '../types';

interface Props {
  children: ReactNode;
  className?: ClassNames;
}

const ItemText = ({ children, className }: Props) => (
  <span className={cx('item-text', className)}>{children}</span>
);

export default ItemText;
