import React, { PropsWithChildren } from 'react';

const Subsection = ({ children }: PropsWithChildren) => (
  <section className='subsection'>
    {children}
  </section>
);

export default Subsection;
