import React, { ReactNode } from 'react';
import { cx } from '@emotion/css';

import ItemDescription from './item-description';
import ItemSubhead from './item-subhead';

interface Props {
  children?: ReactNode;
  className?: string;
  description?: string | ReactNode;
  subtitle?: string | ReactNode;
  title?: string | ReactNode;
}

const StatGroup = ({
  children,
  className,
  description,
  subtitle,
  title,
}: Props) => (
  <div className={cx('activity-stat-group', className)}>
    {(title || subtitle) ? (
      <ItemSubhead title={title} subtitle={subtitle}>
        {description && (
          <ItemDescription className='incident-activity-stat-groups-description'>
            {description}
          </ItemDescription>
        )}
      </ItemSubhead>
    ) : null}
    {children}
  </div>
);

export default StatGroup;
