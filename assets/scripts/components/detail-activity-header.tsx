import React, { ReactNode } from 'react';

import Header, { Content, Intro } from './header';

interface Props {
  content?: ReactNode;
  intro?: ReactNode;
  title: string;
}

const ActivityHeader = ({
  content,
  intro,
  title,
}: Props) => (
  <Header className='activity-header'>
    <h4>{title}</h4>
    {intro && (
      <Intro>
        {intro}
      </Intro>
    )}
    {content && (
      <Content>
        {content}
      </Content>
    )}
  </Header>
);

export default ActivityHeader;
