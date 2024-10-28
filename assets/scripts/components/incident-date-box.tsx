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
  const hasIncident = Boolean(incident?.value);

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

  if (!hasIncident) return null;

  return (
    <StatBox className='activity-stat-details' title={incident.label}>
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
