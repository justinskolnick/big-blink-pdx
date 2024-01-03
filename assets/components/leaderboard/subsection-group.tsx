import React, { ReactNode } from 'react';
import { cx, css } from '@emotion/css';

const styles = css`
  .item-subhead {
    h5 {
      display: flex;
    }
  }

  .item-subhead + .item-chart,
  .item-subhead + .item-table {
    margin-top: var(--gap);
  }

  .item-table + .leaderboard-more {
    margin-top: var(--gap);
  }
`;

interface Props {
  children: ReactNode;
}

const LeaderboardSubsectionGroup = ({ children }: Props) => (
  <div className={cx('leaderboard-subsection-group', styles)}>
    {children}
  </div>
);

export default LeaderboardSubsectionGroup;
