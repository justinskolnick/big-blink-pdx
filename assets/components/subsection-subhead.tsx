import React, { ReactNode } from 'react';
import { cx, css } from '@emotion/css';

import ItemDescription from './item-description';
import ItemSubhead from './item-subhead';

const styles = css`
  .item-subhead {
    h4 {
      color: var(--color-accent);
      font-weight: 600;
      font-size: 15px;
    }

    .item-description {
      color: var(--color-text-lighter);
      font-size: 13px;
    }
  }

  @media screen and (min-width: 813px) {
    padding-top: 1px;

    .item-subhead {
      position: sticky;
      top: 6px;
    }
  }

  @media screen and (max-width: 812px) {
    & + .leaderboard-subsection-group,
    & + .incident-activity-stat-groups-list {
      margin-top: calc(2 * var(--gap));
    }
  }
`;

interface Props {
  children?: ReactNode;
  title: string | ReactNode;
}

const SubsectionSubhead = ({ children, title }: Props) => (
  <div className={cx(
    'subsection-header',
    styles
  )}>
    <ItemSubhead title={title}>
      {children && (
        <ItemDescription>{children}</ItemDescription>
      )}
    </ItemSubhead>
  </div>
);

export default SubsectionSubhead;
