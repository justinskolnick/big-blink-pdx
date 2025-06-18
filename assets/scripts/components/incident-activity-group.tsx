import React, { ReactNode } from 'react';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { cx } from '@emotion/css';

import Icon from './icon';
import ItemSubsection from './item-subsection';
import StatGroup from './stat-group';

import type { Attendees, PersonEntityRole, SourceEntities } from '../types';

interface Props {
  children?: ReactNode;
  className?: string;
  group?: Attendees | PersonEntityRole | SourceEntities;
  icon?: IconName;
  title?: string | ReactNode;
}

const IncidentActivityGroup = ({
  children,
  className,
  group,
  icon,
  title,
}: Props) => {
  const hasIcon = Boolean(icon);

  return (
    <StatGroup
      className={cx('incident-activity-stat-group', className)}
      subtitle={
        <>
          {hasIcon && <Icon name={icon} />}
          <span className='item-text'>{title || group.label}</span>
        </>
      }
    >
      {children && <ItemSubsection>{children}</ItemSubsection>}
    </StatGroup>
  );
};

export default IncidentActivityGroup;
