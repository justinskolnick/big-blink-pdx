import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';

import IncidentQuarterlyActivityChart from '../incident-activity-chart-quarterly';

import api from '../../services/api';

import { getPeopleChartData } from '../../selectors';

interface Props {
  label: string;
}

const Chart = ({ label }: Props) => {
  const [trigger] = api.useLazyGetPersonStatsByIdQuery();

  const { id } = useParams();
  const numericId = Number(id);

  const peopleData = useSelector(getPeopleChartData);
  const data = peopleData?.[numericId];
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
