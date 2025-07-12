import React, { ReactNode, RefObject } from 'react';

import Header from './header';

interface Props {
  children: ReactNode;
  ref?: RefObject<HTMLElement>
}

const Section = ({ children, ref }: Props) => (
  <section className='leaderboard-section' ref={ref}>
    <Header />
    {children}
  </section>
);

export default Section;
