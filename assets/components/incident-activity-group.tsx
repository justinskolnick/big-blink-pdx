import React, { ReactNode } from 'react';
import { cx, css } from '@emotion/css';

import ItemTextWithIcon from './item-text-with-icon';
import StatGroup from './stat-group';

import { IconName } from '@fortawesome/fontawesome-svg-core';

interface Props {
  children: ReactNode;
  className?: string;
  icon: IconName;
  title?: string | ReactNode;
}

const styles = css`
  .item-subsection {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(261px, 1fr));
    grid-gap: var(--gap);
  }

  .item-subhead + .item-subsection {
    margin-top: var(--gap);
  }

  .activity-stat-titles {
    font-size: 13px;
    font-weight: 200;
  }

  .activity-stat-value {
    table {
      width: 100%;
    }
  }

  .activity-stat-titles + .activity-stat-value {
    margin-top: var(--gap);
  }
`;

export const IncidentActivityGroup = ({
  children,
  className,
  icon,
  title,
}: Props) => (
  <StatGroup
    className={cx('incident-activity-stat-group', styles, className)}
    subtitle={
      <ItemTextWithIcon icon={icon}>
        {title}
      </ItemTextWithIcon>
    }
  >
    <div className='item-subsection'>{children}</div>
  </StatGroup>
);

export default IncidentActivityGroup;
