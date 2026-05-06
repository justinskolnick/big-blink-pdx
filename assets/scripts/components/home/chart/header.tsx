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

  return (
    <Header>
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
