import React, { ReactNode } from 'react';
import { cx } from '@emotion/css';

interface Props {
  children: ReactNode;
  isGrid?: boolean;
}

const LeaderboardSubsection = ({ children, isGrid = false }: Props) => (
  <section className={cx(
    'leaderboard-subsection',
    isGrid && 'is-grid',
  )}>
    {children}
  </section>
);

export default LeaderboardSubsection;
