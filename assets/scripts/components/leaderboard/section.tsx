import React, { ReactNode, RefObject } from 'react';

import Filters from './filters';
import Header from './header';

import type { Ref } from '../../types';

interface Props {
  children: ReactNode;
  ref?: Ref;
}

const Section = ({ children, ref }: Props) => (
  <section className='leaderboard-section' ref={ref}>
    <Header />
    <Filters />

    {children}
  </section>
);

export default Section;
