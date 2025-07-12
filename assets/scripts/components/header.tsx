import React, { ReactNode } from 'react';
import { cx } from '@emotion/css';

interface OverviewProps {
  children: ReactNode;
}

interface Props {
  children: ReactNode;
  className?: string;
}

export const HeaderOverview = ({ children }: OverviewProps) => (
  <div className='header-overview'>{children}</div>
);

const Header = ({ children, className }: Props) => (
  <header className={cx('header', className)}>
    {children}
  </header>
);

export default Header;
