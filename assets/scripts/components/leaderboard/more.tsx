import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const More = ({ children }: Props) => (
  <div className='leaderboard-more'>
    {children}
  </div>
);

export default More;
