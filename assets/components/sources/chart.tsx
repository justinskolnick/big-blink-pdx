import React from 'react';

import IncidentActivityChart from '../incident-activity-chart';
import ItemChart from '../item-chart';

interface Props {
  label: string;
}

const Chart = ({ label }: Props) => (
  <IncidentActivityChart>
    <ItemChart label={label} />
  </IncidentActivityChart>
);

export default Chart;
