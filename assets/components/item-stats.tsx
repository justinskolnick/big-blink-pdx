import React, { ReactNode } from 'react';
import { css, cx } from '@emotion/css';

interface ItemStatsProps {
  children: ReactNode;
  className?: string;
}

const styles = css`
  .item-subhead + .activity-stat-group,
  .item-subhead + .activity-stat {
    margin-top: var(--gap);
  }

  & > .activity-stat-group {
    & + .activity-stat-group {
      margin-top: calc(2 * var(--gap));
    }
  }

  @media screen and (max-width: 612px) {
    .activity-stat-group + .activity-stat-group {
      margin-top: var(--gap);
    }
  }

  .activity-stat-subtitle {
    font-weight: 200;
  }

  .activity-stat-title + .activity-stat-subtitle {
    margin-left: 3px;
  }

  .activity-stat-value {
    height: 100%;

    table {
      width: 100%;
    }
  }
`;

const ItemStats = ({ children, className }: ItemStatsProps) => (
  <div className={cx('item-stats', styles, className)}>
    {children}
  </div>
);

export default ItemStats;
