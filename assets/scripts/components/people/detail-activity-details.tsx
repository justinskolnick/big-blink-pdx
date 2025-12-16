import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const ActivityDetails = ({ children }: Props) => (
  <section className='activity-details'>
    {children}
  </section>
);

export default ActivityDetails;
