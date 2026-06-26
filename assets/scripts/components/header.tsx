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

export const Details = ({ children }: ContainerProps) => (
  <div className='header-details'>{children}</div>
);

export const Intro = ({ children }: ContainerProps) => (
  <div className='header-intro'>{children}</div>
);

export const Title = ({ children }: ContainerProps) => (
  <div className='header-title'>{children}</div>
);

const Header = ({ children, className, isLoading = false }: Props) => (
  <header className={cx('header', className, isLoading && 'is-loading')}>
    {children}
  </header>
);

export default Header;
