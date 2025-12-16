import React, { ReactNode } from 'react';
import { IconName } from '@fortawesome/fontawesome-svg-core';

import Icon from './icon';
import ItemSubsection from './item-subsection';
import IncidentActivityGroup from './incident-activity-group';

import type { Attendees, PersonEntityRole, SourceEntities } from '../types';

interface RecordsGroupProps {
  children?: ReactNode;
  group?: Attendees | PersonEntityRole | SourceEntities;
  icon?: IconName;
  title?: string | ReactNode;
}

interface Props {
  children: ReactNode;
  group: Attendees | PersonEntityRole | SourceEntities;
  notFoundLabel: string;
}

const RecordsGroup = ({
  children,
  group,
  icon,
  title,
}: RecordsGroupProps) => {
  const hasIcon = Boolean(icon);

  return (
    <IncidentActivityGroup
      subtitle={
        <>
          {hasIcon && <Icon name={icon} />}
          <span className='item-text'>{title || group.label}</span>
        </>
      }
    >
      {children && <ItemSubsection>{children}</ItemSubsection>}
    </IncidentActivityGroup>
  );
};

const AffiliatedRecordsGroup = ({
  children,
  group,
  notFoundLabel,
}: Props) => {
  const hasRecords = group.values.some(value => value.records.length);

  return hasRecords ? (
    <RecordsGroup group={group}>
      {children}
    </RecordsGroup>
  ) : (
    <RecordsGroup title={notFoundLabel} />
  );
};

export default AffiliatedRecordsGroup;
