import React, { ReactNode } from 'react';

import Header, {
  Content,
  Details,
  Intro,
  Overview,
} from './header';

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
    <Overview>
      <Content>
        <h4>{title}</h4>
      </Content>
    </Overview>

    {intro && (
      <Intro>
        <Content>
          {intro}
        </Content>
      </Intro>
    )}
    {content && (
      <Details>
        <Content>
          {content}
        </Content>
      </Details>
    )}
  </Header>
);

export default ActivityHeader;
