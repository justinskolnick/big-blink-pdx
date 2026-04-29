import React from 'react';

import IncidentActivityChart from '../../incident-activity-chart';
import IncidentQuarterlyActivityChart from '../../incident-activity-chart-quarterly';
import { LineProps } from '../../item-chart';

import useSelector from '../../../hooks/use-app-selector';

import {
  getHomeChartData,
  getStatsLabels,
} from '../../../selectors';

const Chart = () => {
  const homeData = useSelector(getHomeChartData);

  const labels = useSelector(getStatsLabels);

  const lineProps: LineProps = {
    entries: {
      data: homeData?.entries ?? [],
      label: labels.entries,
    },
    estimates: {
      data: homeData?.estimates ?? [],
      label: labels.estimates,
    },
  };

  return (
    <div className='home-subsection'>
      <IncidentActivityChart>
        <IncidentQuarterlyActivityChart
          lineProps={lineProps}
        />
      </IncidentActivityChart>
    </div>
  );
};

export default Chart;
