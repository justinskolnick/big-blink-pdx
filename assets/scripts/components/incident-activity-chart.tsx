import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const IncidentActivityChart = ({ children }: Props) => (
  <div className='activity-stat item-chart'>
    {children}
  </div>
);

export default IncidentActivityChart;
