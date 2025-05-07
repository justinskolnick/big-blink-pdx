import React, { useState, MouseEvent } from 'react';

import IncidentModal from './incident-modal';
import { BetterLink as Link } from './links';
import StatBox from './stat-box';

import type { IncidentsStatsValue } from '../types';

interface Props {
  incident: IncidentsStatsValue;
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
      <Link
        to={incident.value.links.self}
        onClick={handleLinkClick}
      >
        {incident.value.contactDate}
      </Link>
      <IncidentModal
        deactivate={deactivate}
        id={incident.value.id}
        isActive={isActive}
      />
    </StatBox>
  );
};

export default IncidentDateBox;
