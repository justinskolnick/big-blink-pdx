import React from 'react';

import Header, {
  Content,
  Intro,
  Title,
} from '../../header';

import useSelector from '../../../hooks/use-app-selector';

import {
  getHasLeaderboardLabels,
  getLeaderboardLabels,
} from '../../../selectors';

import Icon from '../../icon';

const LeaderboardHeader = () => {
  const labels = useSelector(getLeaderboardLabels);
  const hasLabels = useSelector(getHasLeaderboardLabels);

  if (!hasLabels) return null;

  return (
    <Header>
      <Title>
        <Icon name='trophy' />

        <Content>
          <h3>{labels.title}</h3>
          <h4>{labels.period}</h4>
        </Content>
      </Title>

      <Intro>
        <p>{labels.description}</p>
      </Intro>
    </Header>
  );
};

export default LeaderboardHeader;
