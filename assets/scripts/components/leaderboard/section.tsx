import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';

import { getHasLeaderboardData } from '../../selectors';

import Header from './header';

interface Props {
  children: ReactNode;
}

const Section = ({ children }: Props) => {
  const hasData = useSelector(getHasLeaderboardData);

  if (!hasData) return null;

  return (
    <section className='leaderboard-section'>
      <Header />
      {children}
    </section>
  );
};

export default Section;
