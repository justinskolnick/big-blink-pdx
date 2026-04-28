import React, { useEffect } from 'react';
import { useParams } from 'react-router';

import IncidentQuarterlyActivityChart from '../incident-activity-chart-quarterly';
import { LineProps } from '../item-chart';

import useSelector from '../../hooks/use-app-selector';

import {
  getPeopleChartData,
  getStatsLabels,
} from '../../selectors';

import api from '../../services/api';

interface Props {
  label?: string;
}

const Chart = ({ label }: Props) => {
  const [trigger] = api.useLazyGetPersonStatsByIdQuery();

  const { id } = useParams();
  const numericId = Number(id);

  const labels = useSelector(getStatsLabels);

  const chartData = useSelector(getPeopleChartData);
  const personChartData = chartData?.[numericId];

  const hasData = personChartData?.entries?.length > 0;

  const lineProps: LineProps = {
    entries: {
      data: personChartData?.entries,
      label: label || labels.entries,
    },
    // estimates: {
    //   data: personChartData?.estimates,
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
