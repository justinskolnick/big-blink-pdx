import React from 'react';

import Header, {
  Content,
  Intro,
  Overview,
} from '../../header';

import Icon from '../../icon';

const ChartHeader = () => (
  <Header>
    <Overview>
      <Icon name='chart-simple' />
      <Content>
        <h3>Lobbying activity over time</h3>
      </Content>
    </Overview>

    <Intro>
      <p>The figures in the chart below represent the total number of lobbying incident entries submitted to the City of Portland by lobbying entities. Since 2025 Q2, a single entry can represent any number of lobbying interactions. Entry contact types are tallied in an attempt to estimate this number; in many cases, the actual number of interactions are likely much higher.</p>
    </Intro>
  </Header>
);

export default ChartHeader;
