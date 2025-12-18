import React, { ReactNode, RefObject } from 'react';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { cx } from '@emotion/css';

import ItemDescription from './item-description';
import ItemSubhead from './item-subhead';
import SubsectionSubhead from './subsection-subhead';

interface Props {
  children: ReactNode;
  className?: string;
  description?: string | ReactNode;
  icon?: IconName;
  ref?: RefObject<HTMLElement>;
  stylized?: boolean;
  subtitle?: string | ReactNode;
  title?: string | ReactNode;
}

const StatSection = ({
  children,
  className,
  description,
  icon,
  ref,
  stylized = false,
  subtitle,
  title,
}: Props) => (
  <section className={cx('activity-stat-section', className)} ref={ref}>
    {(title || subtitle) && (
      stylized ? (
        <SubsectionSubhead title={title} icon={icon}>
          {description}
        </SubsectionSubhead>
      ) : (
        <ItemSubhead title={title} subtitle={subtitle}>
          {description && (
            <ItemDescription className='incident-activity-stat-groups-description'>
              {description}
            </ItemDescription>
          )}
        </ItemSubhead>
      )
    )}
    {children}
  </section>
);

export default StatSection;
