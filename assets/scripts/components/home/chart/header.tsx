import React from 'react';

import useSelector from '../../../hooks/use-app-selector';

import Header, {
  Content,
  Details,
  Intro,
  Title,
} from '../../header';
import Icon from '../../icon';

import {
  getHomeOverview,
} from '../../../selectors';

const ChartHeader = () => {
  const labels = useSelector(getHomeOverview);
  const hasLabels = 'title' in labels;
  const isLoading = !hasLabels;

  return (
    <Header isLoading={isLoading}>
      <Title>
        <Icon name='chart-simple' />
        <Content>
          <h3>{labels.title}</h3>
        </Content>
      </Title>

      <Intro>
        <Content>
          <p>{labels.intro}</p>
        </Content>
      </Intro>

      <Details>
        <Content>
          <p>{labels.details}</p>
        </Content>
      </Details>
    </Header>
  );
};

export default ChartHeader;
