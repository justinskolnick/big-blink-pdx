import React, { useEffect } from 'react';
import { useParams } from 'react-router';

import IncidentQuarterlyActivityChart from '../incident-activity-chart-quarterly';

import useSelector from '../../hooks/use-app-selector';

import { getEntitiesChartData } from '../../selectors';

import api from '../../services/api';

interface Props {
  label: string;
}

const Chart = ({ label }: Props) => {
  const [trigger] = api.useLazyGetEntityStatsByIdQuery();

  const { id } = useParams();
  const numericId = Number(id);

  const entitiesData = useSelector(getEntitiesChartData);
  const data = entitiesData?.[numericId];
  const hasData = data?.length > 0;

  const lineProps = {
    label,
    data,
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
