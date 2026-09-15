import React, { ReactNode } from 'react';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { cx } from '@emotion/css';

import StatSection from './stat-section';
import SubsectionContent from './subsection-content';

import type { Ref } from '../types';

interface Props {
  children: ReactNode;
  className?: string;
  description?: string | ReactNode;
  icon?: IconName;
  ref?: Ref;
  title?: string | ReactNode;
}

const IncidentActivityGroups = ({
  children,
  className,
  description,
  icon,
  ref,
  title,
}: Props) => (
  <StatSection
    className={cx('subsection', className)}
    icon={icon}
    title={title}
    description={description}
    ref={ref}
    stylized
  >
    <SubsectionContent>
      {children}
    </SubsectionContent>
  </StatSection>
);

export default IncidentActivityGroups;
