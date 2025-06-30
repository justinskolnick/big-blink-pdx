import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { useSelector } from 'react-redux';

import ItemChart from '../item-chart';

import { getEntitiesChartData } from '../../selectors';

import api from '../../services/api';

interface Props {
  label: string;
}

const Chart = ({ label }: Props) => {
  const [trigger] = api.useLazyGetEntityStatsByIdQuery();

  const { id } = useParams();
  const numericId = Number(id);

  const [searchParams, setSearchParams] = useSearchParams();
  const quarterParam = searchParams.get('quarter');
  const [quarter, setQuarter] = useState(quarterParam);

  const entitiesData = useSelector(getEntitiesChartData);
  const data = entitiesData?.[numericId];
  const hasData = data?.length > 0;

  const lineProps = {
    label,
    data,
  };

  const handleClick = (value: string) => {
    setQuarter(value.split(' ').sort().join('-'));
  };

  useEffect(() => {
    if (!hasData) {
      trigger({ id: numericId });
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
    <ItemChart lineProps={lineProps} handleClick={handleClick} />
  );
};

export default Chart;
