import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import fetchFromPath from '../lib/fetch-from-path';
import { RootState } from '../lib/store';
import { selectors } from '../reducers/incidents';

import Icon from './icon';
import IncidentStatGroup from './incident-stat-group';
import IncidentTable from './incident-table';
import ItemSubhead from './item-subhead';
import ItemTextWithIcon from './item-text-with-icon';
import { LinkToIncident } from './links';
import Modal from './modal';
import StatBox from './stat-box';

import type { Id } from '../types';

interface Props {
  deactivate: () => void;
  id: Id;
  isActive: boolean;
}

const IncidentModal = ({ deactivate, id, isActive }: Props) => {
  const fetched = useRef(false);
  const location = useLocation();

  const incident = useSelector((state: RootState) => selectors.selectById(state, id));
  const hasIncident = Boolean(incident && 'attendees' in incident);
  const hasNotes = Boolean(incident?.notes);

  useEffect(() => {
    if (hasIncident) return;

    if (!fetched.current) {
      fetchFromPath('/incidents/' + id);
      fetched.current = true;
    }
  }, [fetched, location, hasIncident, id]);

  if (!incident) return null;

  return (
    <Modal className='incident-modal' deactivate={deactivate} isActive={isActive}>
      <section className='modal-incident'>
        <header className='incident-header'>
          <ItemSubhead title={(
            <>
              <Icon name='handshake' />
              <span className='item-text'>
                Lobbying Incident
              </span>
            </>
          )} />
        </header>

        <main className='incident-main'>
          <IncidentTable incident={incident} />

          {hasNotes && (
            <IncidentStatGroup>
              <StatBox className='activity-stat-details' title='Notes regarding this incident' icon='asterisk'>
                {incident.notes || 'None'}
              </StatBox>
            </IncidentStatGroup>
          )}
        </main>

        <footer className='incident-footer'>
          <ItemTextWithIcon icon='link'>
            <LinkToIncident id={incident.id}>
              View the full record
            </LinkToIncident>
          </ItemTextWithIcon>
        </footer>
      </section>
    </Modal>
  );
};

export default IncidentModal;
