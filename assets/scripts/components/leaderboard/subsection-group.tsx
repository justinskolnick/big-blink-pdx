import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const LeaderboardSubsectionGroup = ({ children }: Props) => (
  <div className='leaderboard-subsection-group'>
    {children}
  </div>
);

export default LeaderboardSubsectionGroup;
