import React from 'react';

import ItemChart from '../item-chart';

interface Props {
  label: string;
}

const Chart = ({ label }: Props) => (
  <ItemChart label={label} />
);

export default Chart;
