import React, { ReactNode, RefObject } from 'react';

import Filters from './filters';
import Header from './header';

interface Props {
  children: ReactNode;
  ref?: RefObject<HTMLElement>
}

const Section = ({ children, ref }: Props) => (
  <section className='leaderboard-section' ref={ref}>
    <Header />
    <Filters />

    {children}
  </section>
);

export default Section;
