import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const LeaderboardSubsectionGroup = ({ children }: Props) => (
  <div className='leaderboard-more'>
    {children}
  </div>
);

export default LeaderboardSubsectionGroup;
