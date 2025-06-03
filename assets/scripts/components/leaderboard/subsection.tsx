import React, { ReactNode } from 'react';
import { cx } from '@emotion/css';

interface Props {
  children: ReactNode;
  isGrid?: boolean;
}

const Subsection = ({ children, isGrid = false }: Props) => (
  <section className={cx(
    'leaderboard-subsection',
    isGrid && 'is-grid',
  )}>
    {children}
  </section>
);

export default Subsection;
