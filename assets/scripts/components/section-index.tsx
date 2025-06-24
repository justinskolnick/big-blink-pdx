import React, { ReactNode } from 'react';
import { cx } from '@emotion/css';

import Loading from './loading';
import Pagination from './pagination';

import type { Pagination as PaginationType } from '../types';

interface IndexProps {
  className?: string;
  children: ReactNode;
}

interface IntroductionProps {
  children: ReactNode;
}

interface ContentProps {
  children: ReactNode;
  isLoading?: boolean;
}

interface Props {
  children: ReactNode;
  className?: string;
  introduction?: ReactNode;
  isLoading?: boolean;
  pagination?: PaginationType;
}

export const Index = ({ className, children }: IndexProps) => (
  <section className={cx('section-index', className)}>
    {children}
  </section>
);

export const Introduction = ({ children }: IntroductionProps) => (
  <section
    className='section-index-introduction'
    id='section-introduction'
  >
    <h4>Introduction</h4>

    {children}
  </section>
);

export const Content = ({ children, isLoading }: ContentProps) => (
  <div className='item-content'>
    {isLoading ? <Loading /> : children}
  </div>
);

const SectionIndex = ({
  children,
  className,
  introduction,
  isLoading = true,
  pagination,
}: Props) => (
  <Index className={className}>
    {introduction && (
      <Introduction>{introduction}</Introduction>
    )}

    <Content isLoading={isLoading}>
      {children}
    </Content>

    {pagination && (
      <footer className='item-footer'>
        <Pagination pagination={pagination} />
      </footer>
    )}
  </Index>
);

export default SectionIndex;
