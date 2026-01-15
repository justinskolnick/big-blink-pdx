import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const ActivityDetailsSection = ({ children }: Props) => (
  <section className='activity-details-section'>
    {children}
  </section>
);

const ActivityDetails = ({ children }: Props) => (
  <section className='activity-details'>
    {children}
  </section>
);

export default ActivityDetails;
