import React from 'react';
import { useSelector } from 'react-redux';

import ItemChart from '../item-chart';

import { getSourcesDataForChart } from '../../selectors';

const Chart = () => {
  const sources = useSelector(getSourcesDataForChart);
  const data = sources?.data;
  const lineProps = {
    data,
  };

  return (
    <ItemChart lineProps={lineProps} />
  );
};

export default Chart;
