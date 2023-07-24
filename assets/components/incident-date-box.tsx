import React, { useState, MouseEvent } from 'react';

import IncidentModal from './incident-modal';
import { LinkToIncident } from './links';
import StatBox from './stat-box';

import type { IncidentFirstOrLast } from '../types';

interface Props {
  incident: IncidentFirstOrLast;
  title: string;
}

const IncidentDateBox = ({
  incident,
  title,
}: Props) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const deactivate = () => setIsActive(false);
  const handleLinkClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.target instanceof HTMLElement) {
      if (event.target.closest('.activity-stat')) {
        setIsActive(true);
      }
    }
  };

  if (!incident) return null;

  return (
    <StatBox title={title} icon='calendar'>
      <LinkToIncident
        id={incident.id}
        onClick={handleLinkClick}
      >
        {incident.contactDate}
      </LinkToIncident>
      <IncidentModal
        deactivate={deactivate}
        id={incident.id}
        isActive={isActive}
      />
    </StatBox>
  );
};

export default IncidentDateBox;
