import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

import ItemChart from './item-chart';

type LineProps = {
  data: number[];
  label?: string;
}

interface Props {
  lineProps: LineProps;
}

const IncidentQuarterlyActivityChart = ({ lineProps }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const quarterParam = searchParams.get('quarter');
  const [quarter, setQuarter] = useState(quarterParam);

  const handleClick = (value: string) => {
    setQuarter(value.split(' ').sort().join('-'));
  };

  useEffect(() => {
    if (quarter) {
      if (!quarterParam || (quarterParam && quarter && quarterParam !== quarter)) {
        setSearchParams({ quarter });
      }

      setQuarter(null);
    }
  }, [quarterParam, quarter, setSearchParams]);

  return (
    <ItemChart
      lineProps={lineProps}
      handleClick={handleClick}
    />
  );
};

export default IncidentQuarterlyActivityChart;
