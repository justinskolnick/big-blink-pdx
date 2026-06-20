import React, { ReactNode } from 'react';

import Header, { Intro } from './header';

interface Props {
  children?: ReactNode;
  title: string;
}

const ActivityHeader = ({ children, title }: Props) => (
  <Header className='activity-header'>
    <h4>{title}</h4>
    {children && (
      <Intro>
        {children}
      </Intro>
    )}
  </Header>
);

export default ActivityHeader;
