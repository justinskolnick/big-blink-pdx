import React from 'react';
import { css, cx } from '@emotion/css';

import ItemChart from '../item-chart';

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

const Chart = ({ label }: Props) => (
  <div className={cx('activity-stat activity-chart', styles)}>
    <ItemChart label={label} />
  </div>
);

export default Chart;
