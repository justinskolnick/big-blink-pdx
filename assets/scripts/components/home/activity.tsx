import React from 'react';

import Section from './chart/section';
import Chart from './chart/chart';

import useSelector from '../../hooks/use-app-selector';

import { getHomeChartData } from '../../selectors';

const Activity = () => {
  const homeData = useSelector(getHomeChartData);
  const isReady = homeData?.entries !== undefined;

  return (
    <Section>
      {isReady && <Chart />}
    </Section>
  );
};

export default Activity;
