import React, { useState, MouseEvent } from 'react';

import IncidentModal from './incident-modal';
import { LinkToIncident } from './links';
import StatBox from './stat-box';

import type { IncidentFirstOrLast } from '../types';

interface Props {
  incident: IncidentFirstOrLast;
}

const IncidentDateBox = ({ incident }: Props) => {
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
    <StatBox title={incident.label} icon='calendar'>
      <LinkToIncident
        id={incident.value.id}
        onClick={handleLinkClick}
      >
        {incident.value.contactDate}
      </LinkToIncident>
      <IncidentModal
        deactivate={deactivate}
        id={incident.value.id}
        isActive={isActive}
      />
    </StatBox>
  );
};

export default IncidentDateBox;
