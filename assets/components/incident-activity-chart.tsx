import React, { ReactNode } from 'react';
import { css, cx } from '@emotion/css';

interface Props {
  children: ReactNode;
}

const styles = css`
  .item-overview-chart {
    padding: 18px;
    border-radius: 9px;
    background-color: var(--color-stat-light);

    & + .item-article {
      margin-top: 18px;
    }
  }
`;

const IncidentActivityChart = ({ children }: Props) => (
  <div className={cx('activity-stat activity-chart', styles)}>
    {children}
  </div>
);

export default IncidentActivityChart;
