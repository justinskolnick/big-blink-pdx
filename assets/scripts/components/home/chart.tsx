import React from 'react';
import { useSelector } from 'react-redux';

import Icon from '../icon';
import IncidentActivityChart from '../incident-activity-chart';
import ItemChart from '../item-chart';
import ItemSubhead from '../item-subhead';

import {
  getHasSourcesChartData,
  getSourcesDataForChart,
} from '../../selectors';

const Chart = () => {
  const hasData = useSelector(getHasSourcesChartData);
  const sources = useSelector(getSourcesDataForChart);
  const data = sources?.data;
  const lineProps = {
    data,
  };

  if (!hasData) return null;

  return (
    <section className='chart-section'>
      {hasData && (
        <>
          <ItemSubhead subtitle={(
            <>
              <Icon name='chart-simple' />
              <span className='item-text'>
                Lobbying activity over time
              </span>
            </>
          )} />

          <IncidentActivityChart>
            <ItemChart lineProps={lineProps} />
          </IncidentActivityChart>
        </>
      )}
    </section>
  );
};

export default Chart;
