import React, { useEffect, useRef, useState, MouseEvent } from 'react';

import IncidentModal from './incident-modal';
import { BetterLink as Link } from './links';
import StatBox from './stat-box';

import type {
  IncidentsStatsValue,
  RefLinkElement,
} from '../types';

interface Props {
  incident: IncidentsStatsValue;
}

const IncidentDateBox = ({ incident }: Props) => {
  const ref = useRef<RefLinkElement>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const hasIncident = Boolean(incident?.value);

  const deactivate = () => setIsActive(false);
  const handleLinkClick = (event?: MouseEvent) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (event?.target instanceof HTMLElement) {
      if (event?.target.closest('.activity-stat')) {
        setIsActive(true);
      }
    }
  };

  useEffect(() => {
    if (ref?.current && !isActive) {
      ref.current.focus();
    }
  }, [isActive, ref]);

  if (!hasIncident) return null;

  return (
    <StatBox className='activity-stat-details' title={incident.label}>
      {incident.value.links?.self ? (
        <Link
          to={incident.value.links.self}
          onClick={handleLinkClick}
          ref={ref}
        >
          {incident.value.contactDate}
        </Link>
      ) : incident.value.contactDate}
      <IncidentModal
        deactivate={deactivate}
        id={incident.value.id}
        isActive={isActive}
      />
    </StatBox>
  );
};

export default IncidentDateBox;
