import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import IncidentActivityChart from '../incident-activity-chart';
import ItemChart from '../item-chart';

import api from '../../services/api';

import { getPeopleChartData } from '../../selectors';

interface Props {
  label: string;
}

const Chart = ({ label }: Props) => {
  const [trigger] = api.useLazyGetPersonStatsByIdQuery();

  const { id } = useParams();
  const numericId = Number(id);

  const [searchParams, setSearchParams] = useSearchParams();
  const quarterParam = searchParams.get('quarter');
  const [quarter, setQuarter] = useState(quarterParam);

  const peopleData = useSelector(getPeopleChartData);
  const data = peopleData?.[numericId];
  const hasData = data?.length > 0;

  const lineProps = {
    label,
    data,
  };

  const handleClick = (value: string) => {
    setQuarter(value.replace(' ', '-'));
  };

  useEffect(() => {
    if (!hasData) {
      trigger(numericId);
    }
  }, [hasData, numericId, trigger]);

  useEffect(() => {
    if (quarter) {
      if (!quarterParam || (quarterParam && quarter && quarterParam !== quarter)) {
        setSearchParams({ quarter });
      }

      setQuarter(null);
    }
  }, [quarterParam, quarter, setSearchParams]);

  return (
    <IncidentActivityChart>
      <ItemChart lineProps={lineProps} handleClick={handleClick} />
    </IncidentActivityChart>
  );
};

export default Chart;
