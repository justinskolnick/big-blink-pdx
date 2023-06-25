import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { css, cx } from '@emotion/css';

import fetchFromPath from '../../lib/fetch-from-path';

import ItemChart from '../item-chart';

import { getEntitiesChartData } from '../../selectors';

interface Props {
  label: string;
}

const styles = css`
  .item-overview-chart {
    padding: 18px;
    border-radius: 9px;
    background-color: var(--color-stat-light);
    border: 1px solid var(--color-accent-alt-lighter);

    & + .item-article {
      margin-top: 18px;
    }
  }
`;

const Chart = ({ label }: Props) => {
  const fetched = useRef(false);
  const location = useLocation();

  const { id } = useParams();
  const numericId = Number(id);

  const [searchParams, setSearchParams] = useSearchParams();
  const quarterParam = searchParams.get('quarter');
  const [quarter, setQuarter] = useState(quarterParam);

  const entitiesData = useSelector(getEntitiesChartData);
  const data = entitiesData?.[numericId];
  const lineProps = {
    label,
    data,
  };

  const handleClick = (value: string) => {
    setQuarter(value.replace(' ', '-'));
  };

  useEffect(() => {
    if (!fetched.current) {
      const { pathname } = location;

      fetchFromPath(pathname + '/stats');
      fetched.current = true;
    }
  }, [fetched, location]);

  useEffect(() => {
    if (quarter) {
      if (!quarterParam || (quarterParam && quarter && quarterParam !== quarter)) {
        setSearchParams({ quarter });
      }

      setQuarter(null);
    }
  }, [quarterParam, quarter, setSearchParams]);

  return (
    <div className={cx('activity-stat activity-chart', styles)}>
      <ItemChart lineProps={lineProps} handleClick={handleClick} />
    </div>
  );
};

export default Chart;
