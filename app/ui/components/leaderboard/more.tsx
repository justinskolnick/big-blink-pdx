import React, { ReactNode } from 'react';
import { cx, css } from '@emotion/css';

interface Props {
  children: ReactNode;
}

const LeaderboardSubsectionGroup = ({ children }: Props) => (
  <div className={cx('leaderboard-more', css`
    padding-left: 6px;
    padding-right: 6px;

    .icon {
      color: var(--color-light);
      font-size: 10px;
    }

    .item-text {
      font-size: 12px;
    }

    .icon + .item-text {
      margin-left: 2.5ch;
    }
  `)}>
    {children}
  </div>
);

export default LeaderboardSubsectionGroup;
