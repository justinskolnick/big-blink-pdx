import React, { useEffect } from 'react';
import { useParams } from 'react-router';

import IncidentQuarterlyActivityChart from '../incident-activity-chart-quarterly';
import { LineProps } from '../item-chart';

import useSelector from '../../hooks/use-app-selector';

import {
  getEntitiesChartData,
  getStatsLabels,
} from '../../selectors';

import api from '../../services/api';

interface Props {
  label?: string;
}

const Chart = ({ label }: Props) => {
  const [trigger] = api.useLazyGetEntityStatsByIdQuery();

  const { id } = useParams();
  const numericId = Number(id);

  const labels = useSelector(getStatsLabels);

  const chartData = useSelector(getEntitiesChartData);
  const entityChartData = chartData?.[numericId];

  const hasData = entityChartData?.entries?.length > 0;

  const lineProps: LineProps = {
    entries: {
      data: entityChartData?.entries,
      label: label || labels.entries,
    },
    // estimates: {
    //   data: entityChartData?.estimates,
    //   label: labels.estimates,
    // },
  };

  useEffect(() => {
    if (!hasData) {
      trigger({ id: numericId });
    }
  }, [hasData, numericId, trigger]);

  return (
    <IncidentQuarterlyActivityChart lineProps={lineProps} />
  );
};

export default Chart;
