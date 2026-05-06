import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const Section = ({ children }: Props) => (
  <section className='home-section chart-section'>
    {children}
  </section>
);

export default Section;
