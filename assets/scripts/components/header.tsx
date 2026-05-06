import React, { ReactNode } from 'react';
import { cx } from '@emotion/css';

import type { ClassNames } from '../types';

interface ContainerProps {
  children: ReactNode;
}

interface Props {
  children: ReactNode;
  className?: ClassNames;
  isLoading?: boolean;
}

export const Overview = ({ children }: ContainerProps) => (
  <div className='header-overview'>{children}</div>
);

export const Content = ({ children }: ContainerProps) => (
  <div className='header-content'>{children}</div>
);

export const Intro = ({ children }: ContainerProps) => (
  <div className='header-intro'>{children}</div>
);

const Header = ({ children, className, isLoading = false }: Props) => (
  <header className={cx('header', className, isLoading && 'is-loading')}>
    {children}
  </header>
);

export default Header;
