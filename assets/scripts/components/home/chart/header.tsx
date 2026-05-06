import React from 'react';

import useSelector from '../../../hooks/use-app-selector';

import Header, {
  Content,
  Intro,
  Overview,
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
      <Overview>
        <Icon name='chart-simple' />
        <Content>
          <h3>{labels.title}</h3>
        </Content>
      </Overview>

      <Intro>
        <p>{labels.intro}</p>
      </Intro>
    </Header>
  );
};

export default ChartHeader;
