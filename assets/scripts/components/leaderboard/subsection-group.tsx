import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const SubsectionGroup = ({ children }: Props) => (
  <div className='leaderboard-subsection-group'>
    {children}
  </div>
);

export default SubsectionGroup;
