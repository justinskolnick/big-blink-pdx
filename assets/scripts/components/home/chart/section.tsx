import React, { ReactNode } from 'react';

import Header from './header';

interface Props {
  children: ReactNode;
}

const Section = ({ children }: Props) => (
  <section className='home-section chart-section'>
    <Header />

    {children}
  </section>
);

export default Section;
